module.exports = {

    development: {
      client: 'mysql',
      connection: {
        host: process.env.DATA_BASE, //Para producao colocar: 'mariadb-homolog'
        port: '3306',
        user: 'user',
        password: '',
        database: ''
      },
      migrations: {
        tableName: 'knexMigrations',
        directory: `${__dirname}/src/database/migrations`
      }
    }
  
  };
  