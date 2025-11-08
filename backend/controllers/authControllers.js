const authModel = require('../models/authModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

class authController {
    login = async (req, res) => {
        const { email, password } = req.body

        if (!email) {
            return res.status(404).json({ message: 'Please provide your email' })
        }
        if (!password) {
            return res.status(404).json({ message: 'Please provide your password' })
        }

        try {
            const user = await authModel.findOne({ email }).select('+password')
            if (user) {
                const match = await bcrypt.compare(password, user.password)
                if (match) {
                    // Generate employeeId if not present (for existing users)
                    let employeeId = user.employeeId
                    if (!employeeId) {
                        const generateEmployeeId = () => {
                            const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                            const prefix = letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)];
                            const randomNum = Math.floor(10000000 + Math.random() * 90000000); // 8-digit random number
                            return `${prefix}${randomNum}`;
                        };

                        let isUnique = false;
                        while (!isUnique) {
                            employeeId = generateEmployeeId();
                            const existingUser = await authModel.findOne({ employeeId });
                            if (!existingUser) {
                                isUnique = true;
                            }
                        }

                        // Update user with new employeeId
                        await authModel.findByIdAndUpdate(user._id, { employeeId });
                    }

                    // Set role if not present (for existing users)
                    let role = user.role
                    if (!role) {
                        switch (user.category) {
                            case 'Admin':
                                role = 'admin';
                                break;
                            case 'Editor':
                                role = 'editor';
                                break;
                            case 'Writer':
                                role = 'writer';
                                break;
                            case 'Reporter/Photographer':
                                role = 'reporter';
                                break;
                            default:
                                role = 'reporter';
                        }
                        await authModel.findByIdAndUpdate(user._id, { role });
                    }

                    const obj = {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        category: user.category,
                        role: role,
                        employeeId: employeeId
                    }
                    const token = await jwt.sign(obj, process.env.JWT_SECRET, {
                        expiresIn: '7d'
                    })
                    return res.status(200).json({ message: 'login success', token })
                } else {
                    return res.status(404).json({ message: 'invalid password' })
                }
            } else {
                return res.status(404).json({ message: 'user not found' })
            }
        } catch (error) {
            console.log(error)
        }

    }

    signup = async (req, res) => {
        const { firstName, lastName, email, password, category } = req.body

        if (!firstName) {
            return res.status(404).json({ message: 'Please provide your first name' })
        }
        if (!lastName) {
            return res.status(404).json({ message: 'Please provide your last name' })
        }
        if (!email) {
            return res.status(404).json({ message: 'Please provide your email' })
        }
        if (!password) {
            return res.status(404).json({ message: 'Please provide your password' })
        }
        if (!category) {
            return res.status(404).json({ message: 'Please provide your category' })
        }
        if (email && !email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
            return res.status(404).json({ message: 'Please provide a valid email' })
        }

        try {
            const user = await authModel.findOne({ email: email.trim() })
            if (user) {
                return res.status(404).json({ message: 'User already exists' })
            } else {
                // Generate unique employee ID
                const generateEmployeeId = () => {
                    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    const prefix = letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)];
                    const randomNum = Math.floor(10000000 + Math.random() * 90000000); // 8-digit random number
                    return `${prefix}${randomNum}`;
                };

                let employeeId;
                let isUnique = false;
                while (!isUnique) {
                    employeeId = generateEmployeeId();
                    const existingUser = await authModel.findOne({ employeeId });
                    if (!existingUser) {
                                isUnique = true;
                    }
                }

                let role;
                switch (category.trim()) {
                    case 'Admin':
                        role = 'admin';
                        break;
                    case 'Editor':
                        role = 'editor';
                        break;
                    case 'Writer':
                        role = 'writer';
                        break;
                    case 'Reporter/Photographer':
                        role = 'reporter';
                        break;
                    default:
                        role = 'reporter'; // fallback to reporter
                }

                const new_user = await authModel.create({
                    name: `${firstName.trim()} ${lastName.trim()}`,
                    email: email.trim(),
                    password: await bcrypt.hash(password.trim(), 10),
                    category: category.trim(),
                    role: role,
                    employeeId: employeeId
                })
                const obj = {
                    id: new_user.id,
                    name: new_user.name,
                    email: new_user.email,
                    category: new_user.category,
                    role: new_user.role,
                    employeeId: new_user.employeeId
                }
                const token = await jwt.sign(obj, process.env.JWT_SECRET, {
                    expiresIn: '7d'
                })
                return res.status(201).json({ message: 'Signup success', token })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }

    add_writer = async (req, res) => {

        const { email, name, password, category } = req.body

        if (!name) {
            return res.status(404).json({ message: 'please provide name' })
        }
        if (!password) {
            return res.status(404).json({ message: 'please provide password' })
        }
        if (!category) {
            return res.status(404).json({ message: 'please provide category' })
        }
        if (!email) {
            return res.status(404).json({ message: 'please provide email' })
        }
        if (email && !email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
            return res.status(404).json({ message: 'please provide valide email' })
        }
        try {
            const writer = await authModel.findOne({ email: email.trim() })
            if (writer) {
                return res.status(404).json({ message: 'User alreasy exit' })
            } else {
                let role;
                switch (category.trim()) {
                    case 'Admin':
                        role = 'admin';
                        break;
                    case 'Editor':
                        role = 'editor';
                        break;
                    case 'Writer':
                        role = 'writer';
                        break;
                    case 'Reporter/Photographer':
                        role = 'reporter';
                        break;
                    default:
                        role = 'reporter'; // fallback to reporter
                }

                const new_writer = await authModel.create({
                    name: name.trim(),
                    email: email.trim(),
                    password: await bcrypt.hash(password.trim(), 10),
                    category: category.trim(),
                    role: role
                })
                return res.status(201).json({ message: 'writer add success', writer: new_writer })
            }
        } catch (error) {
            return res.status(500).json({ message: 'internal server error' })
        }
    }

    get_writers = async (req, res) => {
        try {
            const writers = await authModel.find({ role: "writer" }).sort({ createdAt: -1 })
            return res.status(200).json({ writers })
        } catch (error) {
            return res.status(500).json({ message: 'internal server error' })
        }
    }

    get_writer = async (req, res) => {
        const { id } = req.params

        try {
            const writer = await authModel.findById(id)
            if (!writer) {
                return res.status(404).json({ message: 'Writer not found' })
            }
            return res.status(200).json({ writer })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }

    get_staff = async (req, res) => {
        try {
            const staff = await authModel.find({}).sort({ createdAt: -1 }).select('-password')
            return res.status(200).json({ staff })
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' })
        }
    }

    change_password = async (req, res) => {
        const { old_password, new_password } = req.body
        const { id } = req.userInfo

        if (!old_password) {
            return res.status(400).json({ message: 'Please provide your old password' })
        }
        if (!new_password) {
            return res.status(400).json({ message: 'Please provide your new password' })
        }

        try {
            const user = await authModel.findById(id).select('+password')
            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }

            const match = await bcrypt.compare(old_password, user.password)
            if (!match) {
                return res.status(400).json({ message: 'Old password is incorrect' })
            }

            const hashedNewPassword = await bcrypt.hash(new_password, 10)
            await authModel.findByIdAndUpdate(id, { password: hashedNewPassword })

            return res.status(200).json({ message: 'Password changed successfully' })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }
}

module.exports = new authController()
