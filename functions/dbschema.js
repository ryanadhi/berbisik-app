let db = {
  users: [
    {
      userId: "5Gr8lEsBQDgY1OqRfTn70YkQxGf1",
      email: "user1@mail.com",
      username: "user1",
      createdAt: "2020-05-07T15:46:47.778Z",
      imageUrl:
        "https://firebasestorage.googleapis.com/v0/b/berbisik-app.appspot.com/o/user1-36416068702.jpg?alt=media",
      bio: "Hello world",
      website: "https://user.com",
      location: "Jakarta, Indonesia",
    },
  ],
  whispers: [
    {
      userCreated: "user",
      body: "this is whisper body",
      createdAt: "2020-05-07T06:14:55.392Z",
      likeCount: 5,
      commentCount: 7,
    },
  ],
  comments: [
    {
      userCreated: "user",
      userCreatedImage: "image/dsfsdkfghskdfgs/dgfdhfgdh",
      whisperId: "kdjsfgdksuufhgkdsufky",
      body: "nice one mate!",
      createdAt: "2019-03-15T10:59:52.798Z",
    },
  ],
  notifications: [
    {
      recipient: "user",
      sender: "john",
      read: "true | false",
      whisperId: "kdjsfgdksuufhgkdsufky",
      type: "like | comment",
      createdAt: "2019-03-15T10:59:52.798Z",
    },
  ],
};

const userDetails = {
  // Redux data
  credentials: {
    userId: "N43KJ5H43KJHREW4J5H3JWMERHB",
    email: "user@email.com",
    username: "user",
    createdAt: "2019-03-15T10:59:52.798Z",
    imageUrl: "image/dsfsdkfghskdfgs/dgfdhfgdh",
    bio: "Hello, my name is user, nice to meet you",
    website: "https://user.com",
    location: "Lonodn, UK",
  },
  likes: [
    {
      userCreated: "user",
      whisperId: "hh7O5oWfWucVzGbHH2pa",
    },
    {
      userCreated: "user",
      whisperId: "3IOnFoQexRcofs5OhBXO",
    },
  ],
};
