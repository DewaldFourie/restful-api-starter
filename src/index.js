import 'dotenv/config'
import cors from 'cors';
import express from 'express';
import models, { connectDb } from './models';
import routes from './routes';


const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// custom express middleware to assign a userId to a message
app.use(async (req, res, next) => {
    req.context = {
        models,
        me: await models.User.findByLogin('admin')
    };
    next();
});

app.use('/session', routes.session);
app.use('/users', routes.user);
app.use('/messages', routes.message);


// to re-initialize database on very Express server start
const eraseDatabaseOnSync = true;

connectDb().then(async () => {
    if (eraseDatabaseOnSync) {
        await Promise.all([
            models.User.deleteMany({}),
            models.Message.deleteMany({}),
        ]);
        // seed database with initial data
        createUsersWithMessages();
    }

    app.listen(process.env.PORT , () => {
        console.log(`Example app listening on port: ${process.env.PORT}`);
    });
});

const createUsersWithMessages = async () => {
    const user1 = new models.User({
        username: 'admin',
    });

    const user2 = new models.User({
        username: 'tester'
    })

    const message1 = new models.Message({
        text: 'Admin Initial Message',
        user: user1.id,
    });

    const message2 = new models.Message({
        text: 'first test message',
        user: user2.id,
    })

    const message3 = new models.Message({
        text: 'second test message',
        user: user2.id,
    })

    await message1.save();
    await message2.save();
    await message3.save();

    await user1.save();
    await user2.save();
};

