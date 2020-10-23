const request = require("supertest");
const server = require("../api/server");
const db = require("../database/dbConfig");

beforeEach(() => {
    return db.migrate.rollback()
    .then(() => db.migrate.latest())
    .then(() => db.seed.run());
});

describe("server", () => {
    describe("testing things", () => {
        it("can run the test", () => {
            expect(true).toBeTruthy();
        });
    });
});

test("GET /api/auth to be successful", async () => {
    const register = await request(server)
    .post("/api/auth/register")
    .send({ username: "test1", password: "123123"});
    const login = await request(server)
    .post("/api/auth/login")
    .send({ username: "test1", password: "123123"})
    const res = await request(server)
    .get("/api/auth")
    .set("authorization", login.body.token)
    expect(res.status).toBe(200)
    // console.log("THIS IS LOGIN.BODY", res.body)
    expect(res.body).toHaveLength(4)
})

test("POST /api/auth/register to be successful", async () => {
    const register = await request(server)
    .post("/api/auth/register")
    .send({ username: "test1", password: "123"})
    // console.log(register.body);
    expect(register.status).toBe(201)
    expect(register.body[0]).toHaveProperty('username')
})

test("POST /api/auth/login to be successful", async () => {
    const register = await request(server)
    .post("/api/auth/register")
    .send({ username: "test1", password: "123"});
    const login = await request(server)
    .post("/api/auth/login")
    .send({ username: "test1", password: "123"})
    expect(login.status).toBe(200)
    expect(login.body.message).toMatch(/Welcome to our API/)
})