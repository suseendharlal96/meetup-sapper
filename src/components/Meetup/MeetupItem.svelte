<script>
  import { createEventDispatcher } from "svelte";

  import Button from "../UI/Button.svelte";
  import meetups from "../../meetup-store.js";

  export let id;
  export let title;
  export let subtitle;
  export let imageUrl;
  export let description;
  export let address;
  export let email;
  export let isFav;
  let isChanging = false;

  const dispatch = createEventDispatcher();

  function toggleFavorite() {
    isChanging = true;
    fetch(`https://meetup-svelte-74ea9.firebaseio.com/meetups/${id}.json`, {
      method: "PATCH",
      body: JSON.stringify({ isFavorite: !isFav }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed");
        }
        meetups.toggleFavorite(id);
        isChanging = false;
      })
      .catch(err => {
        isChanging = false;
        console.log(err);
      });
  }
</script>

<style>
  article {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    border-radius: 5px;
    background: white;
    margin: 1rem;
  }

  header,
  .content,
  footer {
    padding: 1rem;
  }

  .image {
    width: 100%;
    height: 20rem;
  }

  .image img {
    width: 100%;
    height: 24rem;
  }

  h1 {
    font-size: 1.25rem;
    margin: 0.5rem 0;
    font-family: "Roboto Slab", sans-serif;
  }

  h1.is-favorite {
    background: #01a129;
    color: white;
    padding: 0 0.5rem;
    border-radius: 5px;
  }

  h2 {
    font-size: 1rem;
    color: #808080;
    margin: 0.5rem 0;
  }

  p {
    font-size: 1.25rem;
    margin: 0;
  }

  div {
    text-align: right;
  }

  .content {
    color: red;
    height: 4rem;
  }
</style>

<article>
  <header>
    <h1 class={isFav ? 'is-favorite' : ''}>
      {title}
      {#if isFav}
        <span>(Favorite)</span>
      {/if}
    </h1>
    <h2>{subtitle}</h2>
    <p>{address}</p>
  </header>
  <div class="image">
    <img src={imageUrl} alt={title} />
  </div>
  <div class="content">
    <p>{description}</p>
  </div>
  <footer>
    <Button
      on:click={() => dispatch('editMode', {
          form: true,
          id: id,
          title: title,
          subtitle: subtitle,
          imageUrl: imageUrl,
          description: description,
          address: address,
          isFav: isFav,
          email: email
        })}>
      Edit
    </Button>
    <Button
      mode="outline"
      type="button"
      color={isFav ? null : 'success'}
      on:click={toggleFavorite}>
      {isChanging ? 'Changing...' : isFav ? 'Unfavorite' : 'Favorite'}
    </Button>
    <Button href="/{id}">Show Details</Button>
  </footer>
</article>
