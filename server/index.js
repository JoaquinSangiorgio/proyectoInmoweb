import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";
import { MercadoPagoConfig, Preference } from "mercadopago";

dotenv.config();
const { Pool } = pkg;

// ===========================
// 🔹 POSTGRES (RAILWAY)
// ===========================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ===========================
// 🔹 APP
// ===========================
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: [
    "https://proyecto-inmoweb-gt86.vercel.app",
    "http://localhost:5173",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

// ===========================
// 🔹 TEST
// ===========================
app.get("/", (req, res) => {
  res.send("✅ API conectada y funcionando correctamente");
});

// ===========================
// 🔹 CLIENTES
// ===========================
app.get("/clientes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM clientes ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error obteniendo clientes:", error);
    res.status(500).json({ error: "Error al obtener clientes" });
  }
});

app.post("/clientes", async (req, res) => {
  try {
    const { nombre, email, telefono, propiedades, estado } = req.body;
    const result = await pool.query(
      `INSERT INTO clientes (nombre, email, telefono, propiedades, estado)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [nombre, email, telefono, propiedades, estado]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error creando cliente:", error);
    res.status(500).json({ error: "Error creando cliente" });
  }
});

app.put("/clientes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, telefono, propiedades, estado } = req.body;

    const check = await pool.query(
      "SELECT id FROM clientes WHERE id = $1",
      [id]
    );
    if (check.rows.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    const result = await pool.query(
      `UPDATE clientes
       SET nombre=$1, email=$2, telefono=$3, propiedades=$4, estado=$5
       WHERE id=$6
       RETURNING *`,
      [nombre, email, telefono, propiedades, estado, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error actualizando cliente:", error);
    res.status(500).json({ error: "Error actualizando cliente" });
  }
});

app.delete("/clientes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM clientes WHERE id=$1",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    res.json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error eliminando cliente:", error);
    res.status(500).json({ error: "Error eliminando cliente" });
  }
});

// ===========================
// 🔹 PROPIEDADES
// ===========================
app.get("/propiedades", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM propiedades ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error obteniendo propiedades:", error);
    res.status(500).json({ error: "Error al obtener propiedades" });
  }
});

app.post("/propiedades", async (req, res) => {
  try {
    const { direccion, precio, disponible, foto_url } = req.body;
    const result = await pool.query(
      `INSERT INTO propiedades (direccion, precio, disponible, foto_url)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [direccion, precio, disponible, foto_url || null]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error creando propiedad:", error);
    res.status(500).json({ error: "Error creando propiedad" });
  }
});

app.put("/propiedades/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { direccion, precio, disponible, foto_url } = req.body;

    const result = await pool.query(
      `UPDATE propiedades
       SET direccion=$1, precio=$2, disponible=$3, foto_url=$4
       WHERE id=$5
       RETURNING *`,
      [direccion, precio, disponible, foto_url || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Propiedad no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error actualizando propiedad:", error);
    res.status(500).json({ error: "Error actualizando propiedad" });
  }
});

app.delete("/propiedades/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM propiedades WHERE id=$1",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Propiedad no encontrada" });
    }
    res.json({ message: "Propiedad eliminada correctamente" });
  } catch (error) {
    console.error("❌ Error eliminando propiedad:", error);
    res.status(500).json({ error: "Error eliminando propiedad" });
  }
});

// ===========================
// 🔹 PAGOS (CORREGIDO)
// ===========================
app.get("/pagos", async (req, res) => {
  const result = await pool.query("SELECT * FROM pagos ORDER BY id ASC");
  res.json(result.rows);
});

app.post("/pagos", async (req, res) => {
  try {
    const {
      cliente,
      propiedad,
      monto,
      estado,
      fechaVencimiento,
      fechaPago,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO pagos
       (cliente, propiedad, monto, estado, fecha_vencimiento, fecha_pago)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [cliente, propiedad, monto, estado, fechaVencimiento, fechaPago]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error creando pago:", error);
    res.status(500).json({ error: "Error creando pago" });
  }
});

// ===========================
// 🔹 MERCADO PAGO
// ===========================
const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

app.post("/mercadopago/crear-qr", async (req, res) => {
  try {
    const { titulo, monto, cliente, idPago } = req.body;

    const preference = new Preference(mpClient);

    const result = await preference.create({
      body: {
        items: [
          {
            id: String(idPago || "1"),
            title: titulo || `Pago de ${cliente}`,
            quantity: 1,
            unit_price: Number(monto),
            currency_id: "ARS",
          },
        ],
        payer: { name: cliente },
        metadata: { idPago },
      },
    });

    res.json({
      qr_url:
        result.init_point ||
        result.sandbox_init_point ||
        "https://www.mercadopago.com.ar",
    });
  } catch (error) {
    console.error("❌ Error creando QR MercadoPago:", error);
    res.status(500).json({ error: "Error creando QR" });
  }
});

// ===========================
// 🚀 START
// ===========================
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});
