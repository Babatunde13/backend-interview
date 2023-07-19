import type {AWS} from '@serverless/typescript'
import {register, login, loggedInUser} from '@functions/user'

const serverlessConfiguration: AWS = {
  service: 'backend',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-dynamodb-local', 'serverless-dotenv-plugin', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iam: {
      role: {
        statements: [{
          Effect: 'Allow',
          Action: [
            'dynamodb:DescribeTable',
            'dynamodb:Query',
            'dynamodb:Scan',
            'dynamodb:GetItem',
            'dynamodb:PutItem',
            'dynamodb:UpdateItem',
            'dynamodb:DeleteItem',
          ],
          Resource: 'arn:aws:dynamodb:us-west-2:*:table/UsersTable',
        }],
      },
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: {register, login, loggedInUser},
  package: {individually: true},
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node16',
      define: {'require.resolve': undefined},
      platform: 'node',
      concurrency: 10,
    },
    dynamodb: {
      start: {port: 8000, inMemory: true, migrate: true, docker: true, noStart: true},
      stages: 'dev',
    },
    ['serverless-offline']: {
      httpPort: 3000,
      babelOptions: {
        presets: ['env'],
      },
    },
  },
  resources: {
    Resources: {
      UsersTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'UsersTable',
          AttributeDefinitions: [
            {AttributeName: 'userId', AttributeType: 'S'},
            {AttributeName: 'email', AttributeType: 'S'},
          ],
          KeySchema: [
            {AttributeName: 'userId', KeyType: 'HASH'},
            {AttributeName: 'email', KeyType: 'RANGE'},
          ],
          ProvisionedThroughput: {ReadCapacityUnits: 1, WriteCapacityUnits: 1},
        },
      },
    },
  },
}

module.exports = serverlessConfiguration
