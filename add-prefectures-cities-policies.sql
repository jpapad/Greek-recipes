-- Add RLS policies for prefectures and cities

-- Prefectures policies
CREATE POLICY "Allow public read access on prefectures"
  ON prefectures FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert on prefectures"
  ON prefectures FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on prefectures"
  ON prefectures FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on prefectures"
  ON prefectures FOR DELETE
  TO authenticated
  USING (true);

-- Cities policies
CREATE POLICY "Allow public read access on cities"
  ON cities FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert on cities"
  ON cities FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on cities"
  ON cities FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on cities"
  ON cities FOR DELETE
  TO authenticated
  USING (true);
