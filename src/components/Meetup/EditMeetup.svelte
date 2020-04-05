<script>
  import { createEventDispatcher, onMount } from "svelte";

  import meetups from "../../meetup-store.js";
  import { isEmpty } from "../../validation/validation.js";
  import TextInput from "../UI/TextInput.svelte";
  import Button from "../UI/Button.svelte";

  export let formData;
  let title = "";
  let subtitle = "";
  let address = "";
  let email = "";
  let description = "";
  let isFavorite = false;
  let imageUrl = "";
  let id = "";
  let showForm = null;
  let changing = false;
  let deleting = false;

  $: titleValid = isEmpty(title);
  $: subtitleValid = isEmpty(subtitle);
  $: addressValid = isEmpty(address);
  $: descriptionValid = isEmpty(description);
  $: imageUrlValid = isEmpty(imageUrl);
  $: emailValid = isEmpty(email);
  $: formIsValid =
    titleValid &&
    subtitleValid &&
    addressValid &&
    descriptionValid &&
    imageUrlValid &&
    emailValid;

  const dispatch = createEventDispatcher();

  if (formData) {
    title = formData.title;
    subtitle = formData.subtitle;
    address = formData.address;
    description = formData.description;
    imageUrl = formData.imageUrl;
    isFavorite = formData.isFav;
    address = formData.address;
    email = formData.email;
  }

  function addData() {
    const newMeetup = {
      title: title,
      subtitle: subtitle,
      description: description,
      imageUrl: imageUrl,
      isFavorite: isFavorite,
      contactEmail: email,
      address: address
    };
    if (formData) {
      changing = true;
      fetch(
        `https://meetup-svelte-74ea9.firebaseio.com/meetups/${formData.id}.json`,
        {
          method: "PATCH",
          body: JSON.stringify(newMeetup),
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
        .then(res => {
          if (!res.ok) {
            throw new Error("Failed");
          }
          newMeetup.id = formData.id;
          meetups.editMeetup(formData.id, newMeetup);
          dispatch("add", {
            showForm: false,
            loader: false
          });
        })
        .catch(err => {
          changing = false;
        });
    } else {
      changing = true;
      fetch("https://meetup-svelte-74ea9.firebaseio.com/meetups.json", {
        method: "POST",
        body: JSON.stringify(newMeetup),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error("Failed");
          }
          return res.json();
        })
        .then(data => {
          newMeetup.id = data.name;
          meetups.addMeetup(newMeetup);
          dispatch("add", {
            showForm: false,
            loader: false
          });
          changing = false;
        })
        .catch(err => {
          changing = false;
        });
    }
  }

  function deleteMeetup() {
    deleting = true;
    fetch(
      `https://meetup-svelte-74ea9.firebaseio.com/meetups/${formData.id}.json`,
      {
        method: "DELETE"
      }
    )
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed");
        }
        meetups.deleteMeetup(formData.id);
        dispatch("add", {
          showForm: false,
          loader: false
        });
        deleting = false;
      })
      .catch(err => {
        deleting = false;
      });
  }
</script>

<style>
  form {
    width: 30rem;
    max-width: 90%;
    margin: auto;
  }

  .actions {
    margin-top: 10px;
  }
</style>

<form on:submit|preventDefault={addData}>
  <TextInput
    id="title"
    label="Title"
    value={title}
    on:input={event => (title = event.target.value)} />
  <TextInput
    id="subtitle"
    label="Subtitle"
    value={subtitle}
    on:input={event => (subtitle = event.target.value)} />
  <TextInput
    id="address"
    label="Address"
    value={address}
    on:input={event => (address = event.target.value)} />
  <TextInput
    id="imageUrl"
    label="Image URL"
    value={imageUrl}
    on:input={event => (imageUrl = event.target.value)} />
  <TextInput
    id="email"
    label="E-Mail"
    type="email"
    value={email}
    on:input={event => (email = event.target.value)} />
  <TextInput
    id="description"
    label="Description"
    controlType="textarea"
    value={description}
    on:input={event => (description = event.target.value)} />
  <label for="favorite">
    Favorite?
    <input type="radio" name="fav" value={true} bind:group={isFavorite} />
    Yes
    <input type="radio" name="fav" value={false} bind:group={isFavorite} />
    No
  </label>
  <div class="actions">
    <Button type="submit" mode="outline" disabled={!formIsValid}>
      {changing ? 'Saving...' : 'Save'}
    </Button>
    <Button mode="outline" on:click={deleteMeetup} disabled={!formData}>
      {deleting ? 'Deleting...' : 'Delete'}
    </Button>
  </div>
</form>
