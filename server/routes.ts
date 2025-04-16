import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import fetch from "node-fetch";

const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1350725470781440050/Q4et3O6OUh4cjq2a7UwZo0z6P6qJXSw52mkfAL_AOHtXArjUXM5Cseqtzx6pRGh-P5wh";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for lead form submission
  app.post("/api/leads", async (req, res) => {
    try {
      console.log("Recebendo novo lead:", req.body);
      
      // Validate the request body
      const validatedData = insertLeadSchema.parse(req.body);
      
      // Add timestamp
      const lead = {
        ...validatedData,
        createdAt: new Date().toISOString(),
      };
      
      // Store the lead
      const createdLead = await storage.createLead(lead);
      console.log("Lead armazenado com sucesso:", createdLead);
      
      // Send to Discord webhook
      const discordMessage = {
        embeds: [{
          title: "Novo Lead Recebido!",
          color: 0x00ff00,
          fields: [
            { name: "Nome", value: lead.name },
            { name: "WhatsApp", value: lead.whatsapp },
            { name: "Nome da Loja", value: lead.storeName },
            { name: "Email", value: lead.email || "Não informado" },
            { name: "Cidade", value: lead.city || "Não informada" },
            { name: "Mensagem", value: lead.message || "Não informada" },
            { name: "Data", value: new Date(lead.createdAt).toLocaleString() }
          ]
        }]
      };

      console.log("Enviando para o Discord:", JSON.stringify(discordMessage, null, 2));

      const response = await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(discordMessage),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro ao enviar para o Discord:", {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Discord webhook error: ${response.status} ${response.statusText}`);
      }

      console.log("Lead enviado com sucesso para o Discord");
      
      res.status(201).json({
        message: "Lead submitted successfully",
        lead: createdLead
      });
    } catch (error) {
      console.error("Erro completo:", error);
      
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({
          message: "Validation error",
          error: validationError.message
        });
      } else {
        res.status(500).json({
          message: "Internal server error",
          error: error instanceof Error ? error.message : "An unexpected error occurred"
        });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
