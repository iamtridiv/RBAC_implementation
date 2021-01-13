To start setting up the project->
Step 1: Clone the repository 
        https://github.com/iamtridiv/RBAC_implementation.git

Step 2: Change direcotry  into the cloned repo and run:
        All the dependencies are in the package.json file. So simply run->
        npm install 
Step 3: Put your credentials in the .env file.
        PORT=3000
        MONGODB_URI=YOUR_MONGODB_URI(example: mongodb://localhost:27017)
        DB_NAME=YOUR_DB_NAME
Step 4: Install MongoDB (Linux Ubuntu)
        If you are a Linux(Ubuntu) user, simply download the .deb file and run the following commands
        $ sudo dpkg -i mongodb.deb
        See https://docs.mongodb.com/manual/installation/ for more infos

Step 5: Run Mongo daemon
        run from super user as repository
        #mongod
Step 6: Start the app by->
        npm run dev

        Check on the browser localhost:3000