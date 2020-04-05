<script context="module">
  export function preload(page) {
    return this.fetch("https://meetup-svelte-74ea9.firebaseio.com/meetups.json")
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then(response => {
        const loadedMeetups = [];
        if (response) {
          for (const key in response) {
            loadedMeetups.push({ ...response[key], id: key });
          }
          return { fetchedMeetups: loadedMeetups };
        }
      })
      .catch(err => {
        this.error(500, "Could not fetch Data");
      });
  }
</script>

<script>
  import { onMount, onDestroy } from "svelte";
  import MeetupItem from "../components/Meetup/MeetupItem.svelte";
  import Button from "../components/UI/Button.svelte";
  import meetups from "../meetup-store.js";
  import Header from "../components/UI/Header.svelte";
  import EditMeetup from "../components/Meetup/EditMeetup.svelte";

  export let fetchedMeetups;
  let loadedMeetups = [];
  let meetupsSubscription;
  let loader = true;
  let noData = true;
  let isFavourite = false;
  let actualMeetups;
  let form = false;
  let editMode = false;
  let showDetail = false;
  let formData;
  let detailId = null;
  let activeTitle = "Meetup";

  $: actualMeetups = isFavourite
    ? loadedMeetups.filter(data => data.isFavorite === true)
    : loadedMeetups;

  onMount(() => {
    if (fetchedMeetups) {
      meetupsSubscription = meetups.subscribe(items => (loadedMeetups = items));
      meetups.setMeetups(fetchedMeetups);
      loader = false;
      noData = false;
    }
  });

  function setFav(val) {
    if (val === 1) {
      isFavourite = true;
      document.getElementById("search").value = "";
    } else {
      document.getElementById("search").value = "";
      isFavourite = false;
    }
  }

  function searchMeetup(event) {
    let meetup;
    if (!isFavourite) {
      meetup = [...fetchedMeetups];
    } else {
      meetup = fetchedMeetups.filter(data => data.isFavorite === true);
    }
    const filteredMeetup = meetup.filter(data => {
      if (
        data.title
          .toLowerCase()
          .replace(/\s/g, "")
          .startsWith(event.target.value.toLowerCase().replace(/\s/g, ""))
      ) {
        return data;
      }
    });
    actualMeetups = filteredMeetup;
  }

  function shouldFormShow(event) {
    activeTitle = "Meetup";
    form = event.detail.showForm;
    editMode = event.detail.showForm;
    loader = event.detail.loader;
    setTimeout(() => {
      loader = false;
      noData = false;
    }, 1000);
  }

  function toggleMode() {
    form = !form;
    editMode = false;
    if (form && editMode) {
      activeTitle = "Edit Meetup";
    } else if (form) {
      activeTitle = "Add Meetup";
    } else {
      activeTitle = "Meetup";
    }
  }

  function editMeetup(event) {
    activeTitle = "Edit Meetup";
    form = event.detail.form;
    editMode = event.detail.form;
    const editData = {
      id: event.detail.id,
      title: event.detail.title,
      subtitle: event.detail.subtitle,
      imageUrl: event.detail.imageUrl,
      description: event.detail.description,
      isFav: event.detail.isFav,
      address: event.detail.address,
      email: event.detail.email
    };
    formData = editData;
  }
</script>

<style>
  section {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1rem;
  }

  .filter {
    padding-top: 2rem;
    width: 98.5%;
    display: block;
  }

  .search {
    float: right;
    margin-left: 15px;
  }

  @media (min-width: 768px) {
    section {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>

<svelte:head>
  <title>{activeTitle}</title>
</svelte:head>

<Header />

<Button type="button" on:click={toggleMode}>
  {!form ? 'Add New' : 'Cancel'}
</Button>
{#if form}
  {#if editMode}
    <EditMeetup {formData} on:add={shouldFormShow} />
  {:else}
    <EditMeetup on:add={shouldFormShow} />
  {/if}
{:else if !loader}
  {#if !noData}
    <div class="filter">
      <Button
        type="button"
        color={!isFavourite ? 'success' : null}
        on:click={() => setFav(0)}>
        All
      </Button>
      <Button
        type="button"
        color={isFavourite ? 'success' : null}
        on:click={() => setFav(1)}>
        Favorites
      </Button>
      <label class="search" for="search">
        Search:
        <input
          class="search"
          id="search"
          placeholder="search meetups"
          on:keyup={searchMeetup}
          type="text" />
      </label>
    </div>
    <section id="meetups">
      {#each actualMeetups as meetup}
        <MeetupItem
          id={meetup.id}
          title={meetup.title}
          subtitle={meetup.subtitle}
          description={meetup.description}
          imageUrl={meetup.imageUrl}
          email={meetup.contactEmail}
          address={meetup.address}
          isFav={meetup.isFavorite}
          on:editMode={editMeetup} />
      {/each}
    </section>
  {:else}
    <h2>No meetups found.Pls add one!</h2>
  {/if}
{:else}
  <h1>Loading.....</h1>
{/if}
