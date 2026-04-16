import createContainer from './src/container/index.js';
import createApp from './src/app.js';
import config from './src/config/env.js';

const container = createContainer();
const app = createApp(container);

app.listen(config.PORT, () => {
  console.log(`Server running in ${config.NODE_ENV} mode on port ${config.PORT}`);
});
