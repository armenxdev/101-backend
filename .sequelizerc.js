import path from 'path'

export default {
  'config': path.resolve('config', 'db.sequelize.js'),
  'models-path': path.resolve('models'),
  'seeders-path': path.resolve('seeders'),
  'migrations-path': path.resolve('migrations')
};