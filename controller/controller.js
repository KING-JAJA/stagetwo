const User = require('../model/users');

const apiRequests = async (req, res) => {
    try {
        const { method } = req;

        //FOR ALL POST REQUESTS
        if (method === 'POST') {
            const { name }  = req.body;

            if (typeof name !== 'string') {
            return res.status(400).json({ error: 'Only attribute with string value is expected!' });
            }
            const user = await User.create({ name });
            return res.status(201).json({ message: `User created Successfully with id: ${user.id}` });

        //FOR ALL GET REQUESTS
    } else if (method === 'GET') {
        const { user_id } = req.params;
        
        const user = await User.findOne({ where: { id: user_id } });

        if (!user) {
            return res.status(404).json({ error: 'User not found!' });
        }
        return res.status(200).json({ User: user.name });

            //FOR ALL PUT REQUESTS
        } else if (method === 'PUT') {
            const { user_id } = req.params;
            const { name } = req.body;

            if (typeof name !== 'string') {
                return res.status(400).json({ error: 'Only attribute with string value are expected!' });
            }
            const user = await User.findOne({ where: { id: user_id } });
            if (!user) {
                return res.status(404).json({ error: 'User not found!' });
            }
            await User.update( { name }, {
                where: {
                    id: user_id
                }
            });
            return res.status(200).json({ message: 'User updated successfully' });

            // FOR DELETE REQUESTS
        } else if (method === 'DELETE') {
            const { user_id } = req.params;
            const user = await User.findOne({ where: { id: user_id }});

            if (!user) {
                return res.status(404).json({ error: 'User not found!' });
            }
            await User.destroy({ where: { id: user_id } });

            return res.status(200).json({ message: 'User deleted successfully!' });
        }
    } catch(error) {
        console.error(`An error occured! ${error}`);
        res.status(500).json({ error: 'Internal Server error!' });
    }
};


module.exports = apiRequests;