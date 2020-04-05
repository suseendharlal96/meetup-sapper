import { writable } from "svelte/store";

let meetups = writable([]);

const customMeetup = {
  subscribe: meetups.subscribe,
  setMeetups: meetupData => {
    const data = meetupData.reverse();
    meetups.set(data);
    console.log(meetupData);
  },
  addMeetup: meetup => {
    meetups.update(data => {
      return [meetup, ...data];
    });
  },
  editMeetup: (id, meetup) => {
    console.log(meetup);
    meetups.update(items => {
      console.log(items);
      const updateIndex = items.findIndex(data => data.id === id);
      const updatedMeetups = [...items];
      updatedMeetups[updateIndex] = meetup;
      return updatedMeetups;
    });
  },
  deleteMeetup: id => {
    meetups.update(items => {
      const updatedMeetup = [...items];
      const filtered = updatedMeetup.filter(data => data.id !== id);
      return filtered;
    });
  },
  filterFav: filterFlag => {
    let duplicateMeetup;
    meetups.update(items => {
      duplicateMeetup = [...items];
      if (filterFlag === 1) {
        const favMeetups = duplicateMeetup.filter(
          data => data.isFavorite === true
        );
        return favMeetups;
      } else {
        return duplicateMeetup;
      }
    });
  },
  toggleFavorite: id => {
    let updatedMeetup;
    let updateIndex;
    meetups.update(items => {
      updateIndex = items.findIndex(data => data.id === id);
      updatedMeetup = [...items];
      updatedMeetup[updateIndex].isFavorite = !updatedMeetup[updateIndex]
        .isFavorite;
      return updatedMeetup;
    });
  }
};

export default customMeetup;
