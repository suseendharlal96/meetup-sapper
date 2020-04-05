<script context="module">
  export function preload(page) {
    const meetupId = page.params.id;
    return this.fetch(
      `https://meetup-svelte-74ea9.firebaseio.com/meetups/${meetupId}.json`
    )
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then(response => {
        return { selectedMeetup: { ...response, id: meetupId } };
      })
      .catch(err => {
        this.error(400, "Invalid Id");
      });
  }
</script>

<script>
  import { onDestroy, createEventDispatcher, onMount } from "svelte";

  import meetups from "../meetup-store.js";
  import Button from "../components/UI/Button.svelte";

  export let selectedMeetup;
</script>

<style>
  section {
    margin-top: 4rem;
  }

  .image {
    width: 100%;
    height: 25rem;
  }

  img {
    width: 100%;
    height: 100%;
  }

  .image {
    background: #e7e7e7;
  }

  .content {
    text-align: center;
    width: 80%;
    margin: auto;
  }

  h1 {
    font-size: 2rem;
    font-family: "Roboto Slab", sans-serif;
    margin: 0.5rem 0;
  }

  h2 {
    font-size: 1.25rem;
    color: #6b6b6b;
  }

  p {
    font-size: 1.5rem;
  }
</style>

<svelte:head>
  <title>Meetup Detail</title>
</svelte:head>

<section>
  <div class="image">
    <img src={selectedMeetup.imageUrl} alt={selectedMeetup.title} />
  </div>
  <div class="content">
    <h1>{selectedMeetup.title}</h1>
    <h2>{selectedMeetup.subtitle} - {selectedMeetup.address}</h2>
    <p>{selectedMeetup.description}</p>
    <Button href="mailto:{selectedMeetup.contactEmail}">Contact</Button>
    <Button mode="outline" href="/">Close</Button>
  </div>
</section>
