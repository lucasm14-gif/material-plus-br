import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// Se estiver usando Node abaixo da versão 18, descomente a linha abaixo:
// import fetch from "node-fetch";

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

      // Send to Discord webhook
      try {
        console.log("🚀 Enviando lead para o Discord:", lead);

        const webhookUrl = "https://discord.com/api/webhooks/1350725470781440050/Q4et3O6OUh4cjq2a7UwZo0z6P6qJXSw52mkfAL_AOHtXArjUXM5Cseqtzx6pRGh-P5wh";

        const webhookBody = {
          embeds: [{
            title: "Novo Lead Recebido! 🎉",
            color: 0x1E65DE,
            fields: [
              { name: "Nome", value: lead.name, inline: true },
              { name: "WhatsApp", value: lead.whatsapp, inline: true },
              { name: "Loja", value: lead.storeName, inline: true },
              { name: "Email", value: lead.email || "Não informado", inline: true },
              { name: "Cidade", value: lead.city || "Não informada", inline: true },
              { name: "Mensagem", value: lead.message || "Não informada" }
            ],
            timestamp: new Date().toISOString()
          }]
        };

        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(webhookBody)
        });
      } catch (webhookError) {
        console.error("Erro ao enviar para o Discord:", webhookError);
      }

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
