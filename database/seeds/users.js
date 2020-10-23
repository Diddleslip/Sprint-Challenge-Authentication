
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: 'username1', password: "asd123"},
        {username: 'usrename2', password: "abc123"},
        {username: 'username3', password: "lol123"}
      ]);
    });
};
