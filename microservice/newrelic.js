'use strict'

require('dotenv').config();
/**
 * New Relic agent configuration.
 */
exports.config = {
  /**
   * Array of application names.
   * TIP: Cambia esto al nombre de tu nuevo microservicio en AWS
   */
  app_name: ['Microservice'],
  /**
   * Your New Relic license key.
   */
  license_key: process.env.NEW_RELIC_LICENSE_KEY,

  /**
   * CONFIGURACIÓN DE LOGS (Lo que necesitabas para filtrar)
   */
  application_logging: {
    forwarding: {
      /**
       * En la versión 10, esto habilita el envío automático 
       * de tus logs (Logger, console.log) a la nube de New Relic.
       */
      enabled: true,
      max_samples_stored: 10000
    }
  },

  distributed_tracing: {
    enabled: true
  },

  logging: {
    /**
     * CAMBIO: De 'trace' a 'info'. 
     * 'trace' generaría archivos de texto pesados en tu EC2 de AWS.
     * 'info' es lo ideal para producción.
     */
    level: 'info'
  },

  allow_all_headers: true,

}