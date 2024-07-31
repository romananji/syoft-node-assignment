const express=require("express");
const app=express();
const {open}=require("sqlite")
const path=require("path");
app.use(express.json());
const bcrypt=require("bcrypt");
const dbPath=path.join(__dirname,"databaseData.db");
const sqlite3=require("sqlite3");
const jwt=require("jsonwebtoken");
let db=null;
const initializeDBAndServer=async ()=>{
    try{
        db=await open({
           filename:dbPath,
           driver:sqlite3.Database
        })
        app.listen(3000,()=>{
            console.log(`app is running on the server http://localhost:${3000}`)
        })
    }catch(e){
        console.log(`DB Error:${e.message}`);
        process.exit(1)
    }
}
initializeDBAndServer();
const authenticateToken=(request,response,next)=>{
    let jwtToken=""
    const authHeader=request.headers["authorization"];
    if (authHeader!==undefined){
        jwtToken=authHeader.split(" ")[1]
    }
    if (jwtToken===undefined){
        response.status(400)
        response.send("Token not provided")
    }else{
        jwt.verify(jwtToken,"jwt_token",async (error,user)=>{
            if(error){
                response.status(400)
                response.send("Invalid Access Token")
            }else{
                request.user=user;
               next() 
            }
        })
    }
}
app.get("/",(request,response)=>{
    response.send("anji")
})
app.post("/register/",async (request,response)=>{
    const {username,email,password,role}=request.body;
    const getUsersQuery=`
        SELECT * FROM user WHERE username='${username}';
    `
    const dbUser=await db.get(getUsersQuery);
    if (dbUser!==undefined){
        response.status(400)
        response.send("User already exists");
    }else{
        const hashedPasword= await bcrypt.hash(password,10);
        const postt=`
            INSERT INTO user 
                (username,email,password,role)
            VALUES 
                ('${username}','${email}','${hashedPasword}','${role}')
        `;
        await db.run(postt);
        response.status(200);
        response.send("User created");
    }
})
app.post("/login/",async (request,response)=>{
    const {email,password}=request.body 
    const getUsersQuery=`
        SELECT * FROM user WHERE email='${email}';
    `
    const dbUser=await db.get(getUsersQuery); 
    if (dbUser===undefined){
        response.status(400)
        response.send("Invalid user")
    }else{
        const isPasswordCorrect=await bcrypt.compare(password,dbUser.password);
        if (isPasswordCorrect===true){
            const payload={username:dbUser.username,email:email,role:dbUser.role};
            const jwtToken=jwt.sign(payload,"jwt_token");
            console.log(payload);
            response.status(200);
            response.send(jwtToken);
        }else{
            response.status(400)
            response.send("Invalid password")
        }
    }
})
app.post("/products/",authenticateToken,async(request,response)=>{
    const {user}=request

    const {title,description,inventoryCount}=request.body
    if (user.role==='admin'){
        const postQuery=`
            INSERT INTO product 
                (title,description,inventory_count)
            VALUES 
                ('${title}','${description}',${inventoryCount})
        `;
        await db.run(postQuery);
        response.send("Product added")
    }else{
        response.status(400)
        response.send("Admin token required")
    }
})
app.get("/products/",authenticateToken,async (request,response)=>{
    const {user}=request 
    if (user.role==="admin" || user.role==="manager"){
        const getProductsQuery=`
            SELECT * FROM product;
        `;
        const result=await db.all(getProductsQuery);
        response.send(result)
    }else{
        response.status(400)
        response.send("Admin or manager tokens required");
    }
})
app.put("/products/:productId",authenticateToken,async (request,response)=>{
    const {user}=request 
    const {productId}=request.params;
    const {title,description,inventoryCount}=request.body
    if (user.role==="admin" || user.role==="manager"){
        if (title!==undefined && description!==undefined && inventoryCount!==undefined){
            const updateProductQuery=`
                UPDATE product 
                    SET 
                        title='${title}',
                        description='${description}',
                        inventory_count=${inventoryCount}
                    WHERE 
                        id=${productId};
            `;
        await db.run(updateProductQuery);
        response.send("Product Updated")
        }else{
            response.status(400)
            response.send("All fields are required")
        }
    }else{
        response.status(400)
        response.send("Admin or manager tokens required");
    }
})
app.delete("/products/:productId",authenticateToken,async (request,response)=>{
    const {productId}=request.params;
    const {user}=request;
    if (user.role==='admin'){
        const deleteQuery=`
            DELETE FROM 
                product 
            WHERE 
                id=${productId}
        `;
        await db.run(deleteQuery);
        response.send("Product deleted");
    }else{
        response.status(400)
        response.send("Admin token required")
    }
})
module.exports=app;