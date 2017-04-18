db.artists.find().forEach(function (elem) {
  var obj = {
    youtube: elem.youtube[0],
    bio: elem.bio[0],
    image: elem.image[0],
    location: elem.location[0]
  };
  db.artists.update({_id: elem._id}, {$set:
    {
      'youtube': obj.youtube,
      'bio': obj.bio,
      'image': obj.image,
      'location': obj.location
    }
  });
})