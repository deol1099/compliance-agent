# compliance-agent


## Repo structure
```
complaince-agent/
├── complaince-app/                    # Node Frontend
│   ├── public/
│   ├── src/
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
│
├── Pdf-Merger/                     # Java Maven Backend
│   ├── src/
│   ├── target/
│   ├── .gitignore
│   ├── HELP.md
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── pom.xml
│   └── README.md
└── docker-compose                    # docker compose
└── README.md                    # Root-level README (optional overview)
```

## How to run the project
In the root directory, do ```docker-compose up -d```