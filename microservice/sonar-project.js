// const sonarqubeScanner =  require('sonarqube-scanner');
// sonarqubeScanner(
//     {
//         serverUrl:  'http://localhost:9000',
//         options : {
//             'sonar.sources':  'src',
//             'sonar.tests':  'test',
//             'sonar.inclusions'  :  '**', // Entry point of your code
//             'sonar.test.inclusions':  'test/**/*.spec.ts',
//             'sonar.javascript.lcov.reportPaths':  'coverage/lcov.info',
//             'sonar.testExecutionReportPaths':  'coverage/test-reporter.xml',
//             'sonar.login':  'admin',
//             'sonar.password':  'sonarqube1234',
//             'sonar.coverage.exclusions': 'src/main.ts,src/app.module.ts',
//         }
//     }, () => {});