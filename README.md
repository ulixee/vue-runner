VueRunner is a simple library for quickly prototyping single *.vue files without #[a(href='https://cli.vuejs.org/guide/prototyping.html#instant-prototyping') requiring global addons].

Launch any *.vue file from any NodeJS script with one line of code:

```
new require('vue-runner')('./Example.vue');
```

This makes it much easier to incorporate Vue interfaces into backend scripts and CLI programs.

VueRunner includes support for typescript, pug, scss, and svg. With one additional method you can attach a backend ExpressJS server for quickly prototyping of API commands.

# Installing

```
npm install vue-runner
# or
yard add vue-runner
```

# Creating a Simple Frontend
Initialize VueRunner from any js/ts file and reference your *.vue component as the first argument.

example.ts:
```
import VueRunner from 'vue-runner';

new VueRunner('./Example.vue');
    .isReady.then(() => console.log('READY!!'));
```

Example.vue:
```
<template>
    <h1>Hello!!</h1>
</template>
```

Your *.vue file has all the capabilities of a normal vue template, which means it can load full-blown vue components that import and reference other components.

Complex.vue:
```
<template>
    <h1>Hello!!</h1>
    <my-counter/>
</template>

<script lang="ts">
    import MyCounter from './MyCounter.vue';
</script>
```

# Adding a Simple Backend API

If your .vue components needs a backend API, launch it with one command from your NodeJS script:

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

API routes run on the same port as the frontend UI but under the `/api` path. This removes the need for complex CORS configuration.

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
- port

instance.isReady => Promise

instance.attachAPI((apiServer) => void)

Events:
- listening
- ready
- error

# ToDo:

- Write tests!
