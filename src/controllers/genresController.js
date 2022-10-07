const db = require("../database/models");
const sequelize = db.sequelize;

const genresController = {
  list: async (req, res) => {
    try {
      let {order} = req.query;
      let orders = ["name", "ranking"];

      if (orders.includes(order)) {
        order = order ? order : "id";
      } else {
        throw new Error(
          `El campo ${order} no existe!. Campos admitidos: name y ranking`
        );
      }

      let genres = await db.Genre.findAll({
        order: ["name"],
        attributes: {
          exclude: ["created_at", "updated_at"],
        },
      });

      if (genres) {
        return res.status(200).json({
          ok: true,
          meta: {
            total: genres.length,
          },
          data: genres,
        });
      }
      throw new Error({
        ok: false,
        message: "Hubo un error",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        ok: false,
        message: error.message ? error.message : "Comuniquese con el administrador del sitio"
      });
    }
  },

  detail: async (req, res) => {
    try {

      const {id} = req.params;

      if(isNaN(id)){
        throw new Error('El ID debe ser un numero')
      }

      let genre = await db.Genre.findByPk(id, {
          attributes: {
            exclude: ["created_at", "updated_at"],
          }
      });

      if(genre){
        return res.status(200).json({
          ok: true,
          meta: {
            total: 1,
          },
          data: genre,
        })
      }
      throw new Error("No se encuentra el genero");
      
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        ok: false,
        message: error.message ? error.message : "Comuniquese con el administrador del sitio"
      });
    } 
  }
};

module.exports = genresController;
