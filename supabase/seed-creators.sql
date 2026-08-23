-- Adds sample creators to the database.
-- Run once in the Supabase SQL Editor.
-- Uses the same fields created in the creators table.

insert into creators (name, url, description, imageurl) values
  (
    'Fireship',
    'https://www.youtube.com/@Fireship',
    'High-speed, high-density software tutorials. Best known for the "100 Seconds of Code" series that explains a whole framework before your coffee cools.',
    'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'Kurzgesagt – In a Nutshell',
    'https://www.youtube.com/@kurzgesagt',
    'Beautifully animated science explainers covering everything from black holes to the immune system, with research notes published for every video.',
    'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'Marques Brownlee',
    'https://www.youtube.com/@mkbhd',
    'Widely regarded as the sharpest consumer tech reviewer on the internet. Studio-grade production and refreshingly blunt verdicts on phones, EVs, and gadgets.',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'Adam Savage’s Tested',
    'https://www.youtube.com/@tested',
    'One-day builds, prop replicas, and shop-tool deep dives from the former MythBusters host. A masterclass in making things with your hands.',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'Ali Abdaal',
    'https://www.youtube.com/@aliabdaal',
    'A doctor-turned-creator covering evidence-based productivity, study techniques, and building a creative career without burning out.',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
  );
