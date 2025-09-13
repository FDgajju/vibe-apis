
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { User } from './components/user/model';
import { Post } from './components/post/model';
import { Comment } from './components/comment/model';
import { Reaction } from './components/reaction/model';
import { DB_HOST, DB, DB_PARAMETERS } from './constants/env';

const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf-8'));
const posts = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/posts.json'), 'utf-8'));
const comments = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/comments.json'), 'utf-8'));
const reactions = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/reactions.json'), 'utf-8'));

const dbURI = `${DB_HOST}/${DB}?${DB_PARAMETERS}`;
console.log(dbURI)

const seedDatabase = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log('MongoDB connected...');

    // await User.deleteMany({});
    // await Post.deleteMany({});
    // await Comment.deleteMany({});
    // await Reaction.deleteMany({});
    // console.log('Data destroyed...');

    // await User.create(users);
    await Post.create(posts);
    // await Comment.create(comments);
    // await Reaction.create(reactions);
    console.log('Data imported...');

    await mongoose.disconnect();
    console.log('MongoDB disconnected...');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDatabase();
