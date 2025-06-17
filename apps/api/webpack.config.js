const path = require('path');

module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@app': path.resolve(__dirname, 'src/app'),
      '@domain': path.resolve(__dirname, 'src/app/domain'),
      '@entities': path.resolve(__dirname, 'src/app/domain/entities'),
      '@services': path.resolve(__dirname, 'src/app/domain/services'),
      '@repositories': path.resolve(__dirname, 'src/app/domain/repositories'),
      '@exceptions': path.resolve(__dirname, 'src/app/domain/exceptions'),
      '@infrastructure': path.resolve(__dirname, 'src/app/infrastructure'),
      '@adapters': path.resolve(__dirname, 'src/app/infrastructure/adapters'),
      '@persistence': path.resolve(__dirname, 'src/app/infrastructure/adapters/persistence'),
      '@mongodb': path.resolve(__dirname, 'src/app/infrastructure/adapters/persistence/mongodb'),
      '@web': path.resolve(__dirname, 'src/app/infrastructure/adapters/web'),
      '@controllers': path.resolve(__dirname, 'src/app/infrastructure/adapters/web/controllers'),
      '@dto': path.resolve(__dirname, 'src/app/infrastructure/adapters/web/dto'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@gym': path.resolve(__dirname, 'src/gym'),
      '@config': path.resolve(__dirname, 'src/config'),
    },
  },
};
