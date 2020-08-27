const express = require("express");
const mongoose = require("mongoose");
const server = express();
server.use(express.json({}));
const MONGO_URI = "mongodb://localhost:27017/inmueble";

// Esquema (cuerpo) del inmueble
const inmuebleSchema = mongoose.Schema({
  id: String,
  tipoOperacion: String,
  tipoInmueble: String,
  direccion: String,
  fotos: String,
  ambientes: String,
  metrosCuadrados: String,
  descripcion: String,
  datosPropietario: String
});

// Instancia de la collección de Inmuebles 
// Mongoose agrega s a la colleción porque "sabe" que se trata de varios datos
const Inmueble = mongoose.model("inmueble", inmuebleSchema);

// Get un inmueble por ID -  GET - localhost:3000/inmuebles/id
server.get("/inmuebles/:id", (req, res) => {
  Inmueble.findOne({ id: req.params.id })
    .then((data) => {
      res.json({
        data,
      });
    })
    .catch(() => {
      res.status(404);
      res.json({
        message: "No encuentro el inmueble con ese id",
      });
    });
});

// Get all inmuebles - GET - localhost:3000/inmuebles/
server.get("/inmuebles", (req, res) => {
  Inmueble.find({})
    .then((data) => {
      res.json({
        data,
      });
    })
    .catch(() => {
      res.status(400);
      res.json({
        message: "No puedo regresar todos los inmuebles",
      });
    });
});

//Post Inmuebles - POST - localhost:3000/inmuebles/
server.post("/inmuebles", async (req, res) => {
  try {
    const { id, tipoOperacion, tipoInmueble, direccion, fotos, 
      ambientes, metrosCuadrados, descripcion, datosPropietario}
      = req.body;
    const inmueble = new Inmueble({ id, tipoOperacion, tipoInmueble, direccion, fotos, 
      ambientes, metrosCuadrados, descripcion, datosPropietario});
    await inmueble.save();
    res.json({
      data: inmueble,
    });
  } catch (error) {
    console.log(error);
    res.status(400);
    res.json({
      message: "No pudo crear el inmueble",
    });
  }
});

// Put por inmueble - PUT - localhost:3000/inmuebles/id
server.put("/inmuebles/:id", async (req, res) => {
  try {
    const { id, tipoOperacion, tipoInmueble, direccion, fotos, 
      ambientes, metrosCuadrados, descripcion, datosPropietario} = req.body;

  // Función para buscar y actualizar findOneAndUpdate(), 
    // primer parámetro es por cual se va a buscar, 
    // el segundo define los datos a cambiar, 
    //y el tercero es para recibir como retorno de la función el objeto actualizado
    const inmueble = await Inmueble.findOneAndUpdate(
      {id:req.params.id},
      {
        id, tipoOperacion, tipoInmueble, direccion, fotos, 
      ambientes, metrosCuadrados, descripcion, datosPropietario
      },
      {
        new: true,
      }
    );
    res.json({
      data: inmueble,
    });
  } catch (error) {
    console.log(error);
    res.status(400);
    res.json({
      message: "No pudo modificar el inmueble",
    });
  }
});

// DELETE de inmueble por id - DELTE - localhost:3000/inmuebles/id
server.delete("/inmuebles/:id", (req, res) => {
  console.log(req.params.id)
  Inmueble.findOne({ id: req.params.id }).remove()
    .then(() => {
      res.json({
        message:"Se ha removido el inmueble",
      });
    })
    .catch(() => {
      res.status(404);
      res.json({
        message: "No encuentro el inmueble con ese id",
      });
    });
});


// Iniciar conexión con MongoDB e iniciar servidor express localhost:3000
server.listen(3000, () => {
  mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Is running! http://localhost:3000");
    })
    .catch((error) => {
      console.log("No nos pudimos conectar a mongo !!!!", error);
    });
});