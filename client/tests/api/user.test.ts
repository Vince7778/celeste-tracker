import { getProfile, getThisUser } from "../../src/api/user";

const fetchMock = jest.fn();
window.fetch = fetchMock;

describe("User API", () => {
    describe("getThisUser", () => {
        it("should return properly if logged out", async () => {
            const mockLoggedOut = {
                loggedIn: false,
            };
            fetchMock.mockResolvedValueOnce({
                json: jest.fn().mockResolvedValueOnce(mockLoggedOut),
            });

            const res = await getThisUser();
            expect(res).toEqual(mockLoggedOut);
        });

        it("should return properly if logged in", async () => {
            const mockLoggedIn = {
                loggedIn: true,
                id: 1,
                username: "test",
                roles: [],
            };
            fetchMock.mockResolvedValueOnce({
                json: jest.fn().mockResolvedValueOnce(mockLoggedIn),
            });

            const res = await getThisUser();
            expect(res).toEqual(mockLoggedIn);
        });

        it("should call the callback if provided", async () => {
            const mockLoggedIn = {
                loggedIn: true,
                id: 1,
                username: "test",
                roles: [],
            };
            fetchMock.mockResolvedValueOnce({
                json: jest.fn().mockResolvedValueOnce(mockLoggedIn),
            });
            const mockCallback = jest.fn();

            const res = await getThisUser(mockCallback);
            expect(mockCallback).toHaveBeenCalledWith(mockLoggedIn);
            expect(res).toEqual(mockLoggedIn);
        });
    });

    describe("getProfile", () => {
        it("should return null if the user doesn't exist", async () => {
            fetchMock.mockResolvedValueOnce({
                status: 404,
            });

            const res = await getProfile("test");
            expect(res).toBeNull();
        });

        it("should return the profile if the user exists", async () => {
            const mockProfile = {
                id: 1,
                username: "test",
                creation_date: "2023-01-01T00:00:00.000Z",
                roles: [],
            };
            fetchMock.mockResolvedValueOnce({
                json: jest.fn().mockResolvedValueOnce(mockProfile),
            });

            const res = await getProfile("test");
            expect(res).toEqual(mockProfile);
        });
    });
});
