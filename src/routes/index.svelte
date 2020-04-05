<script>
  import { onMount, onDestroy } from "svelte";
  import MeetupItem from "../components/Meetup/MeetupItem.svelte";
  import Button from "../components/UI/Button.svelte";
  import meetups from "../meetup-store.js";
  import EditMeetup from "../components/Meetup/EditMeetup.svelte";
  import MeetupDetail from "./MeetupDetail.svelte";

  let fetchedMeetups = [];
  let isFavourite = false;
  let actualMeetups;
  let loader = true;
  let form = false;
  let editMode = false;
  let showDetail = false;
  let formData;
  let detailId = null;
  let noData = true;
  let activeTitle = "Meetup";
  let meetupSubscription;

  $: actualMeetups = isFavourite
    ? fetchedMeetups.filter(data => data.isFavorite === true)
    : fetchedMeetups;

  onMount(() => {
    meetupSubscription = meetups.subscribe(items => (fetchedMeetups = items));
    fetch("https://meetup-svelte-74ea9.firebaseio.com/meetups.json")
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then(response => {
        const fetchedMeetups = [];
        loader = false;
        if (response) {
          for (const key in response) {
            fetchedMeetups.push({ ...response[key], id: key });
          }
          meetups.setMeetups(fetchedMeetups);
          noData = false;
        }
      })
      .catch(err => {
        loader = false;
      });
  });

  onDestroy(() => {
    if (meetupSubscription) {
      meetupSubscription.unsubscribe();
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
    // activeTitle = "Add Meetup";
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

  function closeDetailView() {
    showDetail = false;
    activeTitle = "Meetup";
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
  <title>Sapper Meetup</title>
</svelte:head>

{#if !showDetail}
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
            on:showDetails
            on:editMode />
        {/each}
      </section>

      <!-- {/if} -->
    {:else}
      <h2>No meetups found.Pls add one!</h2>
    {/if}
  {:else}
    <h1>Loading.....</h1>
  {/if}
{:else}
  <MeetupDetail meetups={$meetups} {detailId} on:close={closeDetailView} />
{/if}
