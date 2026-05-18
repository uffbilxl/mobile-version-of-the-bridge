-- Tighten public insert policy with a basic non-empty guard
DROP POLICY "Anyone can submit a mentor application" ON public.mentor_applications;
CREATE POLICY "Anyone can submit a mentor application"
  ON public.mentor_applications FOR INSERT
  WITH CHECK (
    length(trim(full_name)) > 0
    AND length(trim(email)) > 0
    AND length(trim(pitch)) > 0
    AND length(trim(skills)) > 0
    AND length(trim(applicant_role)) > 0
  );

-- Lock down SECURITY DEFINER trigger functions
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;