import {Hono} from "hono";
import {handle} from "hono/vercel";
import {csrf} from "hono/csrf";
import {auth} from "@/lib/auth";
import {HTTPException} from "hono/http-exception";
import communities from "@/app/api/[[...route]]/communityRoute";
import adminAgents from "@/app/api/[[...route]]/admin/adminAgentRoute";
import adminCommunities from "@/app/api/[[...route]]/admin/admin-communities";
import adminLuxeCommunities from "@/app/api/[[...route]]/admin/admin-luxe-communities";
import properties from "@/app/api/[[...route]]/properties";
import luxeRoute from "@/app/api/[[...route]]/luxeRoute";
import unitTypes from "@/app/api/[[...route]]/unit-types";
import featured from "@/app/api/[[...route]]/featured";
import agents from "@/app/api/[[...route]]/agentRoute";
import insights from "@/app/api/[[...route]]/insights";
import adminInsight from "@/app/api/[[...route]]/admin/admin-insight";
import adminLanguage from "@/app/api/[[...route]]/admin/admin-language";
import adminAmenity from "@/app/api/[[...route]]/admin/admin-amenity";
import leads from "@/app/api/[[...route]]/leads";
import adminProperties from "@/app/api/[[...route]]/admin/adminPropertyRoute";
import adminAuthors from "@/app/api/[[...route]]/admin/admin-authors";
import adminCities from "@/app/api/[[...route]]/admin/admin-cities";
import adminTypes from "@/app/api/[[...route]]/admin/adminTypeRoute";
import propertyOwners from "@/app/api/[[...route]]/admin/propertyOwnerRoute";
import adminOffplans from "./admin/adminOffplanRoute";
import adminDevelopers from "./admin/admin-developers";
import projectRoutes from "@/features/offplans/server/projectRoutes";
import adminOfferingTypeRoute from "@/app/api/[[...route]]/admin/adminOfferingTypeRoute";
import adminPropertyTypeRoute from "@/app/api/[[...route]]/admin/adminPropertyTypeRoute";
import adminFaqs from "@/app/api/[[...route]]/admin/admin-faqs";
import adminPageMeta from "./admin/admin-page-meta";
import pageMetaRoute from "./pageMetaRoute";


export const runtime = "nodejs"

const app = new Hono<{
    Variables: {
        user: typeof auth.$Infer.Session.user | null;
        session: typeof auth.$Infer.Session.session | null
    }
}>().basePath("/api");


    app.use("admin/*", async (c, next) => {
        const session = await auth.api.getSession({ headers: c.req.raw.headers });

        console.log("Auth middleware - Session check:", session ? "Session found" : "No session");

        if (!session) {
            c.set("user", null);
            c.set("session", null);
            return next();
        }

        c.set("user", session.user);
        c.set("session", session.session);
        return next();
    });


app.onError((err, c) =>
{
    if (err instanceof HTTPException) {
        return err.getResponse();
    }


    return c.json({err: "An Internal Error Occurred"}, 500);
})


const routes = app
    //User Routes
    .route("/featured/properties", featured)
    .route("/communities", communities)
    .route("/properties", properties)
    .route("/luxe", luxeRoute)
    .route("/projects", projectRoutes)
    .route("/unit_types", unitTypes)
    .route("/agents", agents)
    .route("/insights", insights)
    .route("/leads", leads)
    .route("/page-meta", pageMetaRoute)



    .route("/admin/agents", adminAgents)
    .route("/admin/authors", adminAuthors)
    .route("/admin/cities", adminCities)
    .route("/admin/amenities", adminAmenity)
    .route("/admin/languages", adminLanguage)
    .route("/admin/types", adminTypes)
    .route("/admin/insights", adminInsight)
    .route("/admin/developers", adminDevelopers)
    .route("/admin/communities", adminCommunities)
    .route("/admin/luxe-communities", adminLuxeCommunities)
    .route("/admin/offering-types", adminOfferingTypeRoute)
    .route("/admin/property-types", adminPropertyTypeRoute)
    .route("/admin/offplans", adminOffplans)
    .route("/admin/faqs", adminFaqs)
    .route("/admin/properties", adminProperties)
    .route("/admin/page-meta", adminPageMeta)
    // .route("/auth/properties", workspaces)


    .route("/crm/property_owners", propertyOwners)


    //Auth Routes
    // .route("/auth/properties", leads);



app.use(csrf());



export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);

export type AppType = typeof routes
