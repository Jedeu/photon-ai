
//////////////////////////////////////////////////////////
// sample data objects for testing, can delete when deploy
var sampleUser = {
  email: 'user@example.com'
};

var sampleUserObjExt = {
  id: 14,
  name: 'Laurel',
  photos: [
    {
      "id":252,"width":4592,"height":3448,"url":"https://images.unsplash.com/photo-1434077471918-4ea96e6e45d5","tags":[{"name":"sky","type":"label"},{"name":"cloud","type":"label"}]
    },
  ]
};

var sampleUserObj = {
  id: 9,
  name: 'Jason',
  photos: [
    {
      id: 22,
      url: 'images/22.jpg',
      width: 1080,
      height: 1080,
      tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6']
    },
    {
      id: 26,
      url: 'images/26.jpg',
      width: 1080,
      height: 717,
      tags: ['tag1', 'tag2', 'tag4', 'tag6']
    },
    {
      id: 20,
      url: 'images/20.jpg',
      width: 1080,
      height: 1080,
      tags: ['tag1', 'tag3', 'tag4', 'tag6']
    },
    {
      id: 36,
      url: 'images/36.jpg',
      width: 720,
      height: 1080,
      tags: ['tag2', 'tag4', 'tag5']
    },
    {
      id: 39,
      url: 'images/39.jpg',
      width: 1080,
      height: 720,
      tags: ['tag1', 'tag5', 'tag6']
    },
    {
      id: 18,
      url: 'images/18.jpg',
      width: 1080,
      height: 720,
      tags: ['tag5', 'tag6']
    },
    {
      id: 9,
      url: 'images/9.jpg',
      width: 1080,
      height: 720,
      tags: ['tag1', 'tag2', 'tag5', 'tag6']
    },
    {
      id: 35,
      url: 'images/35.jpg',
      width: 1080,
      height: 1080,
      tags: ['tag1', 'tag2']
    },
    {
      id: 33,
      url: 'images/33.jpg',
      width: 950,
      height: 650,
      tags: ['tag1', 'tag2', 'tag6']
    },
  {
    id: 24,
    url: 'images/24.jpg',
    width: 1080,
    height: 654,
    tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6']
  }
  ],
  recommendedPhotos: [
  {
    id: 36,
    url: 'images/36.jpg',
    width: 720,
    height: 1080,
    tags: ['tag2', 'tag4', 'tag5']
  },
  {
    id: 39,
    url: 'images/39.jpg',
    width: 1080,
    height: 720,
    tags: ['tag1', 'tag5', 'tag6']
  }
  ],
};

var samplePhotoObj1 = {
  "id": 6,
  "url": "https://images.unsplash.com/photo-1432383079404-c66efb4828a3",
  "width": 3900,
  "height": 3120,
  "tags": [{"name":"sea","type":"label"},{"name":"coast","type":"label"},{"name":"water","type":"label"},{"name":"ocean","type":"label"},{"name":"shore","type":"label"},{"name":"reflection","type":"label"},{"name":"stack","type":"label"}]
};

var samplePhotoObj2 = {
  id: 0,
  url: 'images/24.jpg',
  width: 1080,
  height: 654,
  tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6']
};

var samplePhotoObjExt = {
  id: 456,
  url: 'https://images.unsplash.com/photo-1449177009399-be6867ef0505',
  smallURL: 'http://104.131.96.71/unsafe/fit-in/800x4000/images.unsplash.com/photo-1449177009399-be6867ef0505',
  width: 5616,
  height: 3744,
  tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6']
};

var samplePhotoObjExtNoWidth = {
  id: 756,
  url: 'https://images.unsplash.com/photo-1449177009399-be6867ef0505',
  tags: ['tag1', 'tag3', 'tag5']
};

var samplePhotosObj = {
  photos: [
    {
      id: 22,
      url: 'images/22.jpg',
      width: 1080,
      height: 1080,
      tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6']
    },
    {
      id: 26,
      url: 'images/26.jpg',
      width: 1080,
      height: 717,
      tags: ['tag1', 'tag2', 'tag4', 'tag6']
    },
    {
      id: 20,
      url: 'images/20.jpg',
      width: 1080,
      height: 1080,
      tags: ['tag1', 'tag3', 'tag4', 'tag6']
    },
    {
      id: 36,
      url: 'images/36.jpg',
      width: 720,
      height: 1080,
      tags: ['tag2', 'tag4', 'tag5']
    },
    {
      id: 39,
      url: 'images/39.jpg',
      width: 1080,
      height: 720,
      tags: ['tag1', 'tag5', 'tag6']
    },
    {
      id: 18,
      url: 'images/18.jpg',
      width: 1080,
      height: 720,
      tags: ['tag5', 'tag6']
    },
    {
      id: 9,
      url: 'images/9.jpg',
      width: 1080,
      height: 720,
      tags: ['tag1', 'tag2', 'tag5', 'tag6']
    },
    {
      id: 35,
      url: 'images/35.jpg',
      width: 1080,
      height: 1080,
      tags: ['tag1', 'tag2']
    },
    {
      id: 33,
      url: 'images/33.jpg',
      width: 950,
      height: 650,
      tags: ['tag1', 'tag2', 'tag6']
    },
    {
      id: 31,
      url: 'images/31.jpg',
      width: 280,
      height: 280,
      tags: ['tag1', 'tag2', 'tag3', 'tag4']
    },
    {
      url: 'images/24.jpg',
      width: 1080,
      height: 654,
      tags: ['tag1', 'tag4', 'tag5', 'tag6']
    },
    {
      url: 'images/2.jpg',
      width: 1080,
      height: 391,
      tags: ['tag1', 'tag2', 'tag3', 'tag4']
    },
    {
      url: 'images/21.jpg',
      width: 1080,
      height: 608,
      tags: ['tag1', 'tag4', 'tag5', 'tag6']
    },
    {
      url: 'images/4.jpg',
      width: 1080,
      height: 720,
      tags: ['tag1', 'tag2', 'tag3']
    },
    {
      url: 'images/17.jpg',
      width: 1080,
      height: 720,
      tags: ['tag2', 'tag5', 'tag6']
    },
    {
      url: 'images/12.jpg',
      width: 1080,
      height: 720,
      tags: ['tag3', 'tag4']
    },
    {
      url: 'images/19.jpg',
      width: 1080,
      height: 719,
      tags: ['tag1', 'tag3', 'tag6']
    },
    {
      url: 'images/15.jpg',
      width: 1080,
      height: 683,
      tags: ['tag1', 'tag3', 'tag4', 'tag5']
    },
    {
      url: 'images/32.jpg',
      width: 1080,
      height: 721,
      tags: ['tag1', 'tag2', 'tag5', 'tag6']
    },
    {
      url: 'images/28.jpg',
      width: 1080,
      height: 705,
      tags: ['tag1', 'tag3', 'tag6']
    }
  ]
};
