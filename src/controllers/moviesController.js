const db = require("../database/models");
const { Op } = require("sequelize");


const moviesController = {
  list: async (req, res) => {
    
    try {

      let movies = await db.Movie.findAll({
        order: ['title'],
        attributes: {
          exclude: ["created_at", "updated_at"],
        },
      })

      if(movies){
        return res.status(200).json({
          ok: true,
          meta: {
            total: movies.length,
          },
          data: movies,
        });
      }
      throw new Error({
        ok: false,
        message: "Hubo un error",
      });

    } catch(error) {
      console.log(error);
      return res.status(500).json({
        ok: false,
        message: error.message ? error.message : 'Comuniquese con el administrador del sitio'
      })
    }
   
  },
   

detail: async (req, res) => {

    try{
        const {id} = req.params;

        if(isNaN(id)){
            throw new Error('El ID debe ser un número')
        }
        let movie = await db.Movie.findByPk(id,{
            
            include: [{
                all: true
            }]
        })
        if(movie){
            return res.status(200).json({
                ok: true,
                meta: {
                  total: 1,
                },
                data: movie,
              })
        }
        throw new Error(`La pelicula asociada al id: ${id} no existe`)

    } catch(error) {
        return res.status(error.status || 500).json({
            ok: false,
            message: error.message ? error.message : "Comuniquese con el administrador del sitio" 
        })
    }
  },
  new: async (req, res) => {
  
    try {

        let movies = await db.Movie.findAll({
            order: [
                ['release_date', 'DESC']
            ],
            limit : req.query.limit || 5
        });
        if(movies.length){
            return res.status(200).json({
                ok: true,
                meta: {total: movies.length},
                data: movies
            })
        };
        throw new Error('No existen peliculas recientes')
    

    } catch(error) {
      return res.status(error.status || 500).json({
        ok: false,
        message: error.message ? error.message : "Comuniquese con el administrador del sitio" 
      })
    } 

  },


recomended: async (req, res) => {

  try {
    let recomendado = await db.Movie.findAll({
      include: ["genre"],
      where: {
        rating: { [Op.gte]: 8 },
      },
      order: [["rating", "DESC"]],
    });

    if(recomendado){
      return res.status(200).json({
        ok: true,
        meta: {total: recomendado.length},
        data: recomendado
      })
    } 
    throw new Error(`No existen peliculas recomendadas`)

  } catch(error) {
    return res.status(error.status || 500).json({
      ok: false,
      message: error.message ? error.message : "Comuniquese con el administrador del sitio" 
    })
  }

},
  //Aqui dispongo las rutas para trabajar con el CRUD

  create: async (req, res) => {
      try {
          const {title, rating, awards, release_date, length, genre_id} = req.body;
          let createdMovie = await db.Movie.create({
            title: title.trim(),
            rating,
            awards,
            release_date,
            length,
            genre_id
          })
          if(createdMovie){
            return res.status(200).json({
              ok: true,
              meta: {total: createdMovie.length},
              data: createdMovie
            })
          }
          throw new Error('No se pudo crear la pelicula')

      } catch(error) {
        return res.status(error.status || 500).json({
          ok: false,
          message: error.message ? error.message : "Comuniquese con el administrador del sitio" 
        })
      }  
      
  },
  
  update: async (req, res) => {

    try {
      let movieId = req.params.id;
      const {title, rating, awards, release_date, length, genre_id} = req.body;
      
      let updatedMovie = await db.Movie.update(
        {
          title: title.trim(),
          rating,
          awards,
          release_date,
          length,
          genre_id
        },
        { 
          where: {id: movieId}
        })
      if(updatedMovie){
        return res.status(200).json({
          ok: true,
          message: 'La pelicula ha sido actualizada'
        })
      }
      throw new Error('No se pudo actualizar')
      

    } catch(error) {
      return res.status(error.status || 500).json({
        ok: false,
        message: error.message ? error.message : "Comuniquese con el administrador del sitio" 
      })
    }
   
     
  },
  
  destroy: async (req, res) => {

    try {
      let movieId = req.params.id;
      let deletedMovie = await db.Movie.destroy({
         where: { id: movieId }, 
         force: true // force: true es para asegurar que se ejecute la acción
      }) 
      if(deletedMovie){
        return res.status(200).json({
          ok: true,
          message: 'La pelicula ha sido eliminada',
          data: deletedMovie
        })
      }
      throw new Error('No se pudo eliminar')
  
    } catch (error) {
      return res.status(error.status || 500).json({
        ok: false,
        message: error.message ? error.message : "Comuniquese con el administrador del sitio" 
      })
    }
     
  }
};

module.exports = moviesController;
