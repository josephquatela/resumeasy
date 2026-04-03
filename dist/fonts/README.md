# Font Files

This directory is where TTF font files should be placed for exact PDF font rendering.

The PDF renderer (`src/components/pdf/ResumePDF.tsx`) currently uses built-in PDF fonts as fallbacks:
- Serif fonts (Georgia, Garamond, Merriweather, Libre Baskerville) -> Times-Roman
- Sans-serif fonts (Lato, Source Sans Pro) -> Helvetica

To use real fonts, drop the following TTF files here and update the `Font.register` calls in `ResumePDF.tsx`:

- `Georgia.ttf`
- `Garamond.ttf` (or EBGaramond-Regular.ttf)
- `Merriweather-Regular.ttf`
- `Lato-Regular.ttf`
- `SourceSansPro-Regular.ttf`
- `LibreBaskerville-Regular.ttf`

These can be downloaded from Google Fonts (https://fonts.google.com) as TTF files.
