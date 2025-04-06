import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for lead form submission
  app.post("/api/leads", async (req, res) => {
    try {
      // Validate the request body
      const validatedData = insertLeadSchema.parse(req.body);
      
      // Add timestamp
      const lead = {
        ...validatedData,
        createdAt: new Date().toISOString(),
      };
      
      // Store the lead
      const createdLead = await storage.createLead(lead);
      
      res.status(201).json({
        message: "Lead submitted successfully",
        lead: createdLead
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ 
          message: "Validation error", 
          errors: validationError.details 
        });
      } else {
        console.error("Error creating lead:", error);
        res.status(500).json({ 
          message: "Failed to submit lead information" 
        });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
