import {Hono} from "hono";
import {db} from "@/db/drizzle";
import {zValidator} from "@hono/zod-validator";
import {z} from "zod";
import {eq} from "drizzle-orm";
import {createId} from "@paralleldrive/cuid2";
import {employeeCreateSchema, employeeTable} from "@/db/schema/employee-table";
import {User} from "lucia";

const app = new Hono()


    /**
     * Handles GET requests to fetch all employees.
     *
     * @returns {Promise<Response>} - A JSON response containing all employees.
     */
    .get("/", async (c) => {
        // Query the database to find all employees
        const data = await db.query.employeeTable.findMany()
        // Return the employees data as a JSON response
        return c.json({data})
    })



    /**
     * Handles POST requests to create a new employee.
     *
     * @param {Object} values - The new values for the employee's information.
     * @param {string} values.firstName - The first name of the employee.
     * @param {string} values.lastName - The last name of the employee.
     * @param {string} values.avatarUrl - The URL of the employee's avatar.
     * @param {boolean} values.isActive - The active status of the employee.
     * @param {string} values.bio - The biography of the employee.
     * @param {string} values.phone - The phone number of the employee.
     * @param {string} values.email - The email address of the employee.
     * @returns {Promise<Response>} - A JSON response containing the created employee data or an error message if the user is not authenticated.
     */
    .post("/",
        zValidator("json", employeeCreateSchema.omit({
            id: true,
            slug: true
        })),
        async (c) => {

            // Extract the user from the request context
            const user: User = (c.get as any)("user");

            // If the user is not authenticated, return a 401 error response
            if (!user) {
                return c.json({Unauthorized: "Please log in or your session to access resource."}, 401);
            }

            // Extract the validated JSON body from the request
            const {
                firstName,
                lastName,
                avatarUrl,
                isActive,
                bio,
                phone,
                email,
            } = c.req.valid('json');

            // Generate a slug from the first and last name
            const slug = `${firstName}-${lastName}`.toLowerCase().replace(/\s/g, "-");

            // Insert the new employee data into the database
            const data = await db.insert(employeeTable).values({
                id: createId(),
                firstName,
                slug,
                lastName,
                avatarUrl,
                isActive,
                bio,
                phone,
                email,
            })

            // Return the created employee data as a JSON response
            return c.json({data});

        })



    /**
     * Handles POST requests to update an agent's information by agent ID.
     *
     * @param {string} agentId - The ID of the agent to update.
     * @param {Object} values - The new values for the agent's information.
     * @param {string} values.firstName - The first name of the agent.
     * @param {string} values.lastName - The last name of the agent.
     * @param {string} values.avatarUrl - The URL of the agent's avatar.
     * @param {boolean} values.isActive - The active status of the agent.
     * @param {string} values.bio - The biography of the agent.
     * @param {string} values.phone - The phone number of the agent.
     * @param {string} values.email - The email address of the agent.
     * @returns {Promise<Response>} - A JSON response containing the updated agent data or an error message if the user is not authenticated.
     */
    .post("/:agentId",
        zValidator("param", z.object({
            agentId: z.string().optional()
        })),
        zValidator("json", employeeCreateSchema.omit({
            id: true,
            slug: true
        })),
        async (c) => {

            // Extract the user from the request context
            const user: User = (c.get as any)("user");

            // If the user is not authenticated, return a 401 error response
            if (!user) {
                return c.json({Unauthorized: "Please log in or your session to access resource."}, 401);
            }

            // Extract the validated JSON body from the request
            const values = c.req.valid('json');

            // Extract the agentId parameter from the request
            const {agentId} = c.req.param();

            // Update the agent's information in the database
            const data = await db.update(employeeTable).set({
                ...values
            }).where(eq(employeeTable.id, agentId))

            // Return the updated agent data as a JSON response
            return c.json({data});

        })



    /**
     * Handles GET requests to fetch property owners assigned to a specific agent by agent ID.
     *
     * @param {string} agentId - The ID of the agent to fetch assigned property owners for.
     * @returns {Promise<Response>} - A JSON response containing the assigned property owners.
     */
    .get("/assigned/:agentId/property_owners",
        zValidator("param", z.object({
            agentId: z.string().optional()
        })),
        async (c) => {

            // Extract the agentId parameter from the request
            const {agentId} = c.req.param();

            // Query the database to find property owners assigned to the agent
            const data = await db.query.assignedOwnersTable.findMany({
                where: eq(employeeTable.id, agentId)
            })

            // Return the assigned property owners data as a JSON response
            return c.json({data})
        })

export default app