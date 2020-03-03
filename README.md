VueRunner is a simple library for quickly prototyping single *.vue files [without requiring global addons](https://cli.vuejs.org/guide/prototyping.html#instant-prototyping).

Use VueRunner to launch any *.vue file from any NodeJS script with one line of code:

```javascript
new require('vue-runner')('./Example.vue');
```

VueRunner makes it easy to incorporate Vue UI pages into backend scripts and CLI programs.

VueRunner includes support for typescript, pug, scss, and svg. With one additional method you can attach a backend ExpressJS server for quickly prototyping of API commands.

# Installing

```bash
npm install vue-runner
# --- or ---
yard add vue-runner
```

# Creating a Simple Frontend
Initialize VueRunner from any js/ts file and reference your *.vue component as the first argument.

*example.ts*:
```typescript
import VueRunner from 'vue-runner';

new VueRunner('./Example.vue');
  .isReady.then(() => console.log('READY!!'));
```

*Example.vue*:
```
<template>
  <h1>Hello!!</h1>
</template>
```

VueRunner supports all the capabilities of a normal vue template, which means it can load full-blown vue components that import and reference other components.

Complex.vue:
```
<template>
  <h1>Hello!!</h1>
  <my-counter/>
</template>

<script lang="ts">
  import MyCounter from './MyCounter.vue';

  @Component({ components { MyCounter } })
  export default class App extends Vue {}
</script>
```

# Adding a Simple Backend API

If your vue file needs a backend API, VueRunner's attachAPI method makes this easy:

example.ts:
```
import VueRunner from 'vue-runner';

new VueRunner('./API.vue');
  .attachAPI((apiServer) => {
    apiServer.get('/name', (req, res) => {
      res.send('Caleb');
    });
  });
```

The `apiServer` object is a standard [ExpressJS](https://expressjs.com/) instance. 

Your routes run on the same port as the frontend UI but under the `/api` path. This removes the need for complex CORS configuration.

Use our simple API helper library to access with from frontend Vue components.

API.vue
```
<template>
  <div>
    <h1 v-if='name'>Confirming your identity...</h1>
    <h1>Hello, {{name}}!</h1>
  </div>
</template>

<script lang="ts">
  import API from 'vue-runner/API';
  
  class Hello {
    async mounted() {
      this.name = await API.get('/name');
    }
  }
</script>
```

# Full Reference Documentation

new VueRunner(pathToVueFile: string, options?: Options) => instance

Options:
- port - string
- title - string

instance.isReady => Promise

instance.attachAPI((apiServer) => void)

instance.on((event) => void)

Events:
- listening
- ready
- error

# ToDo:

- Write unit tests
- Figure out how to expose vue/webpack configuration and plugins
