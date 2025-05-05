import User  from '../models/User.js';
import bcrypt from 'bcrypt';

 const registerUser = async () => {
  
    try {
            const hashPassword = await bcrypt.hash("admin123", 10);
            const newUser = new User ({
                name: "Admin",
                email: "admin@gmail.com",
                password: hashPassword,
                role: "admin"
            })
            await newUser.save()
        } catch (error) {
            console.error('Error creating user:', error);
        }
}
// export const fetchUsers = async (req, res) => {
//     try {
//         const userData = await users.find();
//         res.status(200).send(userData);
//     } catch (error) {
//         res.status(500).send('Internal Server Error');
//     }
// };

// export const createUsers = async (req, res) => {
//     try {
//         const createUser = req.body;
//         const addedUser = await new users(createUser).save(); // Corrected model usage
//         res.status(201).send(addedUser); // Changed status to 201 (Created)
//     } catch (error) {
//         res.status(500).send('Internal Server Error');
//     }
// };

// export const update = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updatedUser = await users.findByIdAndUpdate(id, req.body, { new: true });
//         if (!updatedUser) {
//             return res.status(404).send('User not found');
//         }
//         res.status(200).send(updatedUser); // Changed status to 200 (OK)
//     } catch (error) {
//         res.status(500).send('Internal Server Error');
//     }
// };

// export const deleteUser = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const deletedUser = await users.findByIdAndDelete(id);
//         if (!deletedUser) {
//             return res.status(404).send('User not found');
//         }
//         res.status(200).send('User deleted successfully');
//     } catch (error) {
//         res.status(500).send('Internal Server Error');
//     }
// };

registerUser();