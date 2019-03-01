const mysql = require('mysql');
const _ = require('lodash');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const connection = mysql.createConnection({
  host: process.env.DBHOST,
  user: process.env.DBUSERNAME,
  password: process.env.DBPASSWORD,
  database: process.env.DBNAME,
});

connection.connect((err) => {
  if (!err) {
    console.log('Houston, we have a db connection');
  } else {
    console.error('There was a problem connecting to the db. Error: ', err);
  }
});

// DB HELPERS //
// all functions are named to explicitly state usage


// This is a good test to see if we are successfully connected to our database

module.exports.insertUser = (username, password, address, zipcode, callback) => {
  // get all users
  module.exports.selectAllUsers((err, users) => {
    // get usernames of all users as an array
    const allUsernames = _.map(users, (user) => {
      return user.username;
    });
    if (!_.includes(allUsernames, username)) {
      // generate random salt
      const salt = crypto.randomBytes(16).toString('hex');
      // generate the password for insertion
      const q = [username, crypto.pbkdf2Sync(password, salt, 1012, 50, 'sha512').toString('hex'), salt, address, zipcode];
      // insert the new user to the db
      connection.query('INSERT INTO users (username, password, salt, address, zipcode) VALUES (?, ?, ?, ?, ?)', q, (err2, res) => {
        if (err2) {
          callback(err2, null);
        } else {
          // select all users
          module.exports.selectAllUsers((err3, newUsers) => {
            if (err3) {
              callback(err3, null);
            } else {
              // send back the new user
              const newUser = newUsers[newUsers.length - 1];
              const userData = {};
              userData.id = newUser.id;
              userData.username = newUser.username;
              userData.address = newUser.address;
              userData.zipcode = newUser.zipcode;
              userData.loggedIn = newUser.loggedIn;
              callback(null, userData);
            }
          });
        }
      });
    } else {
      // send error if user already exists
      callback(Error('User already exists'), null);
    }
  });
};

module.exports.verifyUser = (username, password, callback) => {
  // get a single user through their username
  module.exports.selectUsersByUsername(username, (err, user) => {
    if (err) {
      callback(err, null);
    } else {
      // pass the entered password through the hashing function to get a hash for it
      const comparisonPassword = crypto.pbkdf2Sync(password, user.salt, 1012, 50, 'sha512').toString('hex');
      // compare passwords
      if (comparisonPassword === user.password) {
        // send back user id if passwords match
        module.exports.updateUserLoggedIn(user.id, true, (err2, updatedUser) => {
          if (err2) {
            callback(err2, null);
          } else {
            callback(null, updatedUser);
          }
        });
      } else {
        // send error if no match
        callback(Error('Invalid Username or Password, Please Try Again'), null);
      }
    }
  });
};

module.exports.updateUserLoggedIn = (iduser, trueOrFalse, callback) => {
  // need an integer instead of a boolean
  let valid;
  if (trueOrFalse === true) {
    valid = 1;
  } else {
    valid = 0;
  }
  // update the loggedin field for the user
  connection.query(`UPDATE users SET loggedIn = ${valid} WHERE id = ${iduser}`, (err) => {
    if (err) {
      callback(err, null);
    } else {
      // get the updated user
      connection.query(`SELECT * FROM users WHERE id = ${iduser}`, (err2, users) => {
        if (err2) {
          callback(err2, null);
        } else {
          // send back the user
          const userData = {};
          userData.id = users[0].id;
          userData.username = users[0].username;
          userData.address = users[0].address;
          userData.zipcode = users[0].zipcode;
          userData.loggedIn = users[0].loggedIn;
          callback(null, userData);
        }
      });
    }
  });
};

module.exports.selectUsersByUsername = (username, callback) => {
  // get all users
  module.exports.selectAllUsers((err, users) => {
    if (err) {
      callback(err, null);
    } else {
      // send back the user whose name matches the input
      callback(null, _.filter(users, user => user.username === username)[0]);
    }
  });
};

module.exports.selectUserById = (iduser, callback) => {
  connection.query(`SELECT * FROM users WHERE id = ${iduser}`, (err, singleUserArray) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, singleUserArray[0]);
    }
  });
};

module.exports.selectAllUsers = (callback) => {
  // get all users from db
  connection.query('SELECT * FROM users', (err, users) => {
    if (err) {
      callback(err, null);
    } else {
      // send back all users
      callback(null, users);
    }
  });
};

module.exports.selectAllPlants = (callback) => {
  // get all plants
  connection.query('SELECT * FROM plants', (err, plants) => {
    if (err) {
      callback(err);
    } else {
      // send back plants
      callback(null, plants);
    }
  });
};

// add a plant to the database and assign the plant to a specific user //
module.exports.insertPlant = (iduser, plant, address, zipcode, description, callback) => {
  // assign insertion properties
  const q = [plant, address, zipcode, description];
  // insert into databases
  connection.query('INSERT INTO plants (plant, address, zipcode, description) VALUES (?, ?, ?, ?)', q, (err) => {
    if (err) {
      callback(err, null);
    } else {
      // get all current plants
      module.exports.selectAllPlants((err2, oldPlants) => {
        if (err2) {
          callback(err2, null);
        } else {
          // get the plant that we just added
          const mostRecent = oldPlants[oldPlants.length - 1];
          // assign that plant to a user
          module.exports.insertUserPlant(iduser, mostRecent.id, (err3, userPlant) => {
            if (err3) {
              callback(err3, null);
            } else {
              // return the new table data row
              callback(null, userPlant);
            }
          });
        }
      });
    }
  });
};

// module.exports
// .insertPlant('Apples', '1725 Delachaise St., Apt#108, New Orleans, LA', 70115, 1, (err, res) => {
//   return err;
// });

module.exports.insertUserPlant = (iduser, idplant, callback) => {
  // assign the insertion values
  const q = [iduser, idplant];
  // insert to the database
  connection.query('INSERT INTO usersPlants (iduser, idplant) VALUES (?, ?)', q, (err) => {
    if (err) {
      callback(err, null);
    } else {
      // get all plants assigned to users
      module.exports.selectAllUsersPlants(iduser, (err2, plants) => {
        if (err2) {
          callback(err2, null);
        } else {
          // send back the newest plant assigned to a user
          callback(null, plants[plants.length - 1]);
        }
      });
    }
  });
};

module.exports.selectSinglePlant = (idplant, callback) => {
  // get a single plant through its id
  connection.query(`SELECT * FROM plants WHERE id = ${idplant}`, (err, singlePlantArray) => {
    if (err) {
      callback(err, null);
    } else {
      const returnObject = singlePlantArray[0];
      // get the plant's imagelink
      module.exports.selectPlantImage(returnObject.plant, (err2, imagelink) => {
        if (err2) {
          callback(err2, null);
        } else {
          // set the imagelink
          returnObject.imagelink = imagelink;
          // return the object
          callback(null, returnObject);
        }
      });
    }
  });
};

module.exports.updatePlantLikes = (idplant, bool, callback) => {
  if (bool === true) {
    // if bool is true add like
    // get the plant with the input id
    module.exports.selectSinglePlant(idplant, (err, plant) => {
      if (err) {
        callback(err, null);
      } else {
        // update the plants likes
        connection.query(`UPDATE plants SET likes = ${plant.likes + 1} WHERE id = ${idplant}`, (err2) => {
          if (err2) {
            callback(err2, null);
          } else {
            // get the plant with the updated value
            module.exports.selectSinglePlant(idplant, (err3, updatedPlant) => {
              if (err3) {
                callback(err3, null);
              } else {
                // send back the plant
                callback(null, updatedPlant);
              }
            });
          }
        });
      }
    });
  } else if (bool === false) {
    // if bool is true add like
    // get the plant with the input id
    module.exports.selectSinglePlant(idplant, (err, plant) => {
      if (err) {
        callback(err, null);
      } else {
        // update the plants likes
        connection.query(`UPDATE plants SET likes = ${plant.likes - 1} WHERE id = ${idplant}`, (err2) => {
          if (err2) {
            callback(err2, null);
          } else {
            // get the plants with the updated likes
            module.exports.selectSinglePlant(idplant, (err3, updatedPlant) => {
              if (err3) {
                callback(err3, null);
              } else {
                // send back the plants
                callback(null, updatedPlant);
              }
            });
          }
        });
      }
    });
  } else {
    // edge case
    callback(Error("Incorrect 'bool' value!"), null);
  }
};

// module.exports.updatePlantLikes(1, true, (err, res) => {
//   console.log(err, res);
// });

module.exports.selectAllZipcodePlants = (zipcode, callback) => {
  // get all plants in a specific zip code
  connection.query(`SELECT * FROM plants WHERE zipcode = ${zipcode}`, (err, plants) => {
    if (err) {
      callback(err, null);
    } else {
      // array for holding plants
      const returnArray = [];
      // get image for each plant
      _.forEach(plants, (plant, index) => {
        module.exports.selectPlantImage(plant.plant, (err2, imagelink) => {
          if (err2) {
            callback(err2, null);
          } else {
            plant.imagelink = imagelink;
            returnArray.push(plant);
            if (index === plants.length - 1) {
              // send back the plants
              callback(null, returnArray);
            }
          }
        });
      });
    }
  });
};

// module.exports.selectAllZipcodePlants(70115, (err, res) => {
//   console.log(err, res);
// });

module.exports.selectAllUsersPlants = (iduser, callback) => {
  // get plant ids based on the user
  connection.query(`SELECT * FROM usersPlants WHERE iduser = ${iduser}`, (err, combos) => {
    if (err) {
      callback(err, null);
    } else {
      // get an array of plant ids
      const plantIds = _.map(combos, combo => combo.idplant);
      // array for holding the plants that we are going to return
      const returnPlants = [];
      _.forEach(plantIds, (id, index) => {
        // get a single plant
        module.exports.selectSinglePlant(id, (err2, plant) => {
          if (err2) {
            callback(err2, null);
          } else {
            // add the plant to the return array
            returnPlants.push(plant);
            if (index === plantIds.length - 1) {
              // send back the plants array
              callback(null, returnPlants);
            }
          }
        });
      });
    }
  });
};

// module.exports.selectAllUsersPlants(1, (err, res) => {
//   console.log(err, res);
// });

module.exports.selectAllUsersLikes = (iduser, callback) => {
  // get all likes that are assigned to a specific user id
  connection.query(`SELECT * FROM usersLiked WHERE iduser = ${iduser}`, (err, ids) => {
    // get all of the plant ids
    const plantIds = _.map(ids, combo => combo.idplant);
    // array to return that will hold plant objects
    const returnPlants = [];
    if (plantIds.length === 0) {
    // if no likes return empty array
      callback(null, []);
    } else {
      _.forEach(plantIds, (id, index) => {
        // get a single plants data
        module.exports.selectSinglePlant(id, (error, plant) => {
          if (error) {
            callback(error, null);
          } else {
            // push the plants object of data to the array
            returnPlants.push(plant);
            if (index === plantIds.length - 1) {
              // send back the array
              callback(null, returnPlants);
            }
          }
        });
      });
    }
  });
};

module.exports.insertPlantData = (planttype, imagelink, callback) => {
  const q = [planttype, imagelink];
  // get all current plant data
  connection.query('SELECT * FROM plantData', (err, oldPlants) => {
    if (err) {
      callback(err, null);
    } else {
      // get all plant names
      const plants = _.map(oldPlants, (oldPlant) => {
        return oldPlant.planttype;
      });
      if (!_.includes(plants, planttype)) {
        // if plant doesn't exist, add to db
        connection.query('INSERT INTO plantData (planttype, imagelink) VALUES (?, ?)', q, (err2) => {
          if (err2) {
            callback(err2, null);
          } else {
            // get the newly added plant
            connection.query(`SELECT * FROM plantData WHERE planttype = '${planttype}'`, (err3, plant) => {
              if (err3) {
                callback(err3, null);
              } else {
                // send back plant
                callback(null, plant);
              }
            });
          }
        });
      } else {
        // if plant already exists, say so
        callback(null, 'Already Exists');
      }
    }
  });
};

module.exports.selectAllPlantData = (callback) => {
  // get all plants
  connection.query('SELECT * FROM plantData', (err, plants) => {
    if (err) {
      callback(err, null);
    } else {
      // send all plants in array
      callback(null, plants);
    }
  });
};

module.exports.selectPlantImage = (planttype, callback) => {
  // select a plant based in its id
  connection.query(`SELECT * FROM plantData WHERE planttype = '${planttype}'`, (err, singlePlantArray) => {
    if (err) {
      callback(err, null);
    } else {
      // send back the plants image
      callback(null, singlePlantArray[0].imagelink);
    }
  });
};

module.exports.updateUserLikedPlant = (iduser, idplant, callback) => {
  const q = [iduser, idplant];
  // get all of a specific users liked plants
  module.exports.selectAllUsersLikes(iduser, (err, likes) => {
    if (err) {
      callback(err, null);
    } else if (likes.length === 0) {
      // if there are no like for the user add a like
      // add a like to the db for said user
      connection.query('INSERT INTO usersLiked (iduser, idplant) VALUES (?, ?)', q, (err2) => {
        if (err2) {
          callback(err, null);
        } else {
          // update the specific plants amount of likes
          module.exports.updatePlantLikes(idplant, true, (err3, updatedPlant) => {
            if (err3) {
              callback(err, null);
            } else {
              // send back the updated plant
              callback(null, updatedPlant);
            }
          });
        }
      });
    } else {
      // if the user does have likes
      // get the ids of the plants that the user likes
      const plantIds = _.map(likes, (plant) => {
        return plant.id;
      });
      // check if the user has already liked the plant
      if (!_.includes(plantIds, idplant)) {
        // if they haven't then add the like
        connection.query('INSERT INTO usersLiked (iduser, idplant) VALUES (?, ?)', q, (err2) => {
          if (err2) {
            callback(err, null);
          } else {
            // update the like counter for the plant
            module.exports.updatePlantLikes(idplant, true, (err3, updatedPlant) => {
              if (err3) {
                callback(err3, null);
              } else {
                // send back the updated plant data
                callback(null, updatedPlant);
              }
            });
          }
        });
      } else {
        // if they already have liked the plant, 
        // assume that they don't like it anymore and delete it from their likes
        connection.query(`DELETE FROM usersLiked WHERE iduser = ${iduser} AND idplant = ${idplant}`, (err4, res) => {
          if (err4) {
            callback(err4, null);
          } else {
            // update the plant likes counter
            module.exports.updatePlantLikes(idplant, false, (err5) => {
              if (err5) {
                callback(err5, null);
              } else {
                // get all of the users likes
                module.exports.selectAllUsersLikes(iduser, (err6, updatedLikes) => {
                  if (err6) {
                    callback(err6, null);
                  } else {
                    // send the likes back to the user
                    callback(null, updatedLikes);
                  }
                });
              }
            });
          }
        });
      }
    }
  });
};

module.exports.insertComment = (iduser, idplant, comment, callback) => {
  // get the date
  const date = new Date();
  const q = [parseInt(iduser), parseInt(idplant), comment, date.getHours(), date.getMinutes()];
  // insert new comment
  connection.query('INSERT INTO comments (iduser, idplant, comment, hourcreated, minutecreated) VALUES (?, ?, ?, ?, ?)', q, (err) => {
    if (err) {
      callback(err, null);
    } else {
      // get all comments
      module.exports.selectAllComments((err2, comments) => {
        if (err2) {
          callback(err2, null);
        } else {
          // send back the comment we just created
          callback(null, comments[comments.length - 1]);
        }
      });
    }
  });
};

module.exports.selectAllComments = (callback) => {
  // get all comments
  connection.query('SELECT * FROM comments', (err, comments) => {
    if (err) {
      callback(err, null);
    } else {
      // send back the comments
      callback(null, comments);
    }
  });
};

module.exports.selectAllUsersComments = (iduser, callback) => {
  // get all comments with a specific user id
  connection.query(`SELECT * FROM comments WHERE iduser = ${iduser}`, (err, comments) => {
    if (err) {
      callback(err, null);
    } else {
      // send back the comments
      callback(null, comments);
    }
  });
};

module.exports.selectAllPlantsComments = (idplant, callback) => {
  // get all comments with a specific plant id
  connection.query(`SELECT * FROM comments WHERE idplant = ${idplant}`, (err, comments) => {
    if (err) {
      callback(err, null);
    } else {
      // send back comments
      const commentHolder = [];
      _.forEach(comments, (comment, index) => {
        module.exports.selectUserById(comment.iduser, (err2, user) => {
          if (err2) {
            callback(err2, null);
          } else {
            comment.username = user.username;
            commentHolder.push(comment);
            if (index === comments.length - 1) {
              callback(null, commentHolder);
            }
          }
        });
      });
      callback(null, comments);
    }
  });
};

module.exports.deletePlant = (idplant, callback) => {
  // delete from comments first
  connection.query(`DELETE FROM comments WHERE idplant = ${idplant}`, (err) => {
    if (err) {
      callback(err, null);
    } else {
      // then delete from usersliked
      connection.query(`DELETE FROM usersLiked WHERE idplant = ${idplant}`, (err2) => {
        if (err2) {
          callback(err2, null);
        } else {
          // then delete from usersplants
          connection.query(`DELETE FROM usersPlants WHERE idplant = ${idplant}`, (err3) => {
            if (err3) {
              callback(err3, null);
            } else {
              // finally delete from the plants table
              connection.query(`DELETE FROM plants WHERE id = ${idplant}`, (err4) => {
                if (err4) {
                  callback(err4, null);
                } else {
                  // get the remaining plants
                  module.exports.selectAllPlants((err5, plants) => {
                    if (err5) {
                      callback(err5, null);
                    } else {
                      // send back the plants
                      callback(null, plants);
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
};

module.exports.selectAllToggledOnPlants = (callback) => {
  connection.query('SELECT * FROM plants WHERE toggled = 0', (err, plants) => {
    if (err) {
      callback(err, null);
    } else {
      const plantHolder = [];
      _.forEach(plants, (plant, index) => {
        module.exports.selectPlantImage(plant.plant, (err2, imagelink) => {
          if (err2) {
            callback(err2, null);
          } else {
            plant.imagelink = imagelink;
            plantHolder.push(plant);
            if (index === plants.length - 1) {
              callback(null, plantHolder);
            }
          }
        });
      });
    }
  });
};
