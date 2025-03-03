try {
    const jwt = require('jsonwebtoken');
    console.log('jsonwebtoken is installed.');
} catch (error) {
    console.error('jsonwebtoken is not installed. Please run "npm install jsonwebtoken"');
}