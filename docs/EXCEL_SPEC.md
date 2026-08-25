# Excel-Spezifikation

Siehe auch Excel-Vorlage unter **Einstellungen → Excel-Vorlage** (Download).

## Sheets

| Sheet | Pflicht | Inhalt |
|-------|---------|--------|
| `Classic`, `IO` | Ja | Klassische Umsätze + Trading |
| `Programmatic`, `PC` | Nein | Trading Programmatic |
| `Fee`, `Partner-Fee` | Nein | Partner-Fee |
| `Zusatzleistungen`, `Extras` | Nein | Zusatzleistungen |

## Spalten (Hauptblatt)

- `Network`, `Brutto PY`, `Netto PY`, `Marge PY`, `Brutto CY`, `Netto CY`, `Marge CY`
- Trading: `Tr Brutto PY`, `Tr Netto PY`, `Plan Brutto`, `Plan Netto`, `IST Brutto`, `IST Netto`

## Validierung

Nach Upload zeigt die App einen Validierungsreport (Zeilen, Warnungen, Fehler).

Spalten-Aliase können unter **Einstellungen → Upload-Historie → Spalten-Mapping** als JSON konfiguriert werden.
