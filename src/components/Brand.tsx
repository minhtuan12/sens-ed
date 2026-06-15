import Typography from "@mui/material/Typography";

export function Brand() {
  return (
    <Typography
      component="p"
      sx={{
        color: (theme) => theme.palette.mode === "dark" ? "#ffffff" : theme.palette.text.primary,
        fontSize: { xs: "2.6rem", md: "3.9rem" },
        fontWeight: 800,
        lineHeight: 1
      }}
    >
      SensED
    </Typography>
  );
}
