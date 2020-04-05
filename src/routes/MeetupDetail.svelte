<script>
  import { onDestroy, createEventDispatcher, onMount } from "svelte";

  import meetups from "../meetup-store.js";
  import Button from "../components/UI/Button.svelte";

  export let detailId;
  let selectedMeetup;

  const dispatch = createEventDispatcher();

  const meetupSubscribe = meetups.subscribe(meetupData => {
    selectedMeetup = meetupData.find(data => data.id === detailId);
  });
  //unsubscribe issue??
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

<section>
  <div class="image">
    <img src={selectedMeetup.imageUrl} alt={selectedMeetup.title} />
  </div>
  <div class="content">
    <h1>{selectedMeetup.title}</h1>
    <h2>{selectedMeetup.subtitle} - {selectedMeetup.address}</h2>
    <p>{selectedMeetup.description}</p>
    <Button href="mailto:{selectedMeetup.contactEmail}">Contact</Button>
    <Button type="button" mode="outline" on:click={() => dispatch('close')}>
      Close
    </Button>
  </div>
</section>
