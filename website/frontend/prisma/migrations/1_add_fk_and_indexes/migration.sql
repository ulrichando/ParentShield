-- Add foreign key: device_linking_codes.installation_id → installations.id
ALTER TABLE "device_linking_codes"
  ADD CONSTRAINT "device_linking_codes_installation_id_fkey"
  FOREIGN KEY ("installation_id") REFERENCES "installations"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Add missing indexes on api_keys
CREATE INDEX "api_keys_user_id_idx" ON "api_keys"("user_id");

-- Add missing indexes on webhooks
CREATE INDEX "webhooks_user_id_idx" ON "webhooks"("user_id");
