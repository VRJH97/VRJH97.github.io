import { useState, useMemo } from "react";

const databases = [
  // GENOMICS & GENETICS
  { id: 1, name: "GenBank / NCBI", field: "Genomics & Genetics", subfield: "Sequence Repository", access: "Free", url: "https://www.ncbi.nlm.nih.gov/genbank/", description: "The US NCBI flagship nucleotide sequence repository. Covers genomic assemblies, gene expression, and variation data. Includes sub-databases: dbSNP, ClinVar, dbVar, GEO.", tags: ["DNA", "RNA", "Sequences", "SNPs", "Expression"], org: "NCBI / NIH" },
  { id: 2, name: "Ensembl", field: "Genomics & Genetics", subfield: "Genome Annotation", access: "Free", url: "https://www.ensembl.org", description: "Automatic annotation databases for human, mouse, other vertebrates, and eukaryote genomes. Maintained by EMBL-EBI.", tags: ["Annotation", "Vertebrates", "Genome"], org: "EMBL-EBI" },
  { id: 3, name: "TCGA", field: "Genomics & Genetics", subfield: "Cancer Genomics", access: "Free", url: "https://www.cancer.gov/tcga", description: "The Cancer Genome Atlas. Gene expression, copy number variation, SNP genotyping, DNA methylation, microRNA profiling, and exon sequencing from hundreds of cancer samples.", tags: ["Cancer", "Methylation", "CNV", "miRNA"], org: "NCI / NIH" },
  { id: 4, name: "GWAS Catalog", field: "Genomics & Genetics", subfield: "Association Studies", access: "Free", url: "https://www.ebi.ac.uk/gwas/", description: "Captures data from over 7,000 papers on genome-wide association studies. Run by EMBL-EBI and NHGRI.", tags: ["GWAS", "SNPs", "Disease", "Variants"], org: "EMBL-EBI / NHGRI" },
  { id: 5, name: "1000 Genomes Project", field: "Genomics & Genetics", subfield: "Population Genomics", access: "Free", url: "https://www.internationalgenome.org/", description: "Genomes of more than a thousand anonymous participants from different ethnic groups, analysed and publicly available.", tags: ["Population", "Ethnic diversity", "Variants"], org: "International Consortium" },
  { id: 6, name: "DDBJ", field: "Genomics & Genetics", subfield: "Sequence Archive", access: "Free", url: "https://www.ddbj.nig.ac.jp/", description: "DNA Data Bank of Japan. Part of the INSDC alongside GenBank and ENA. Maintains sequence archives, BioProject, BioSample, and Genomic Expression Archive.", tags: ["Sequences", "Archive", "Japan"], org: "NIG Japan" },

  // PROTEOMICS
  { id: 7, name: "UniProt / UniProtKB", field: "Proteomics", subfield: "Protein Annotation", access: "Free", url: "https://www.uniprot.org/", description: "Gold standard for protein sequence and functional annotation. Manually curated (Swiss-Prot) and computationally annotated (TrEMBL) entries.", tags: ["Proteins", "Sequences", "Function"], org: "EMBL-EBI / SIB / PIR" },
  { id: 8, name: "Protein Data Bank (PDB)", field: "Proteomics", subfield: "3D Structures", access: "Free", url: "https://www.rcsb.org/", description: "Worldwide repository for 3D structures of biological macromolecules via X-ray crystallography, cryo-EM, and NMR.", tags: ["3D Structure", "Crystallography", "cryo-EM"], org: "RCSB" },
  { id: 9, name: "AlphaFold Database", field: "Proteomics", subfield: "Predicted Structures", access: "Free", url: "https://alphafold.ebi.ac.uk/", description: "AI-predicted 3D protein structures from amino acid sequences, covering hundreds of millions of proteins across essentially all known organisms.", tags: ["AI", "Structure Prediction", "DeepMind"], org: "DeepMind / EMBL-EBI" },
  { id: 10, name: "STRING", field: "Proteomics", subfield: "Protein Interactions", access: "Free", url: "https://string-db.org/", description: "Functional, physical, and regulatory protein interaction networks. Upgraded facilities for gene set enrichment analysis.", tags: ["PPI", "Networks", "Interactions"], org: "SIB / EMBL-EBI" },
  { id: 11, name: "InterPro / Pfam", field: "Proteomics", subfield: "Protein Families", access: "Free", url: "https://www.ebi.ac.uk/interpro/", description: "Protein family classification and domain databases. Essential for identifying conserved functional domains.", tags: ["Domains", "Families", "Motifs"], org: "EMBL-EBI" },
  { id: 12, name: "PhosphoSitePlus", field: "Proteomics", subfield: "Post-translational Modifications", access: "Free (basic) / Paid", url: "https://www.phosphosite.org/", description: "Curated database of PTMs including phosphorylation, ubiquitination, acetylation, and methylation across human and model organism proteins.", tags: ["PTM", "Phosphorylation", "Ubiquitination"], org: "Cell Signaling Technology" },

  // CHEMISTRY
  { id: 13, name: "PubChem", field: "Chemistry", subfield: "Chemical Compounds", access: "Free", url: "https://pubchem.ncbi.nlm.nih.gov/", description: "Now draws on over 1,000 data sources and contains over 100 million compounds. Covers chemical structures, bioactivities, assays, and safety data.", tags: ["Compounds", "Bioactivity", "Safety"], org: "NCBI / NIH" },
  { id: 14, name: "ChemSpider", field: "Chemistry", subfield: "Chemical Database", access: "Free", url: "https://www.chemspider.com/", description: "Large chemical structure database with links to suppliers, literature, and spectral data. Over 100 million structures.", tags: ["Structures", "Spectral", "Suppliers"], org: "Royal Society of Chemistry" },
  { id: 15, name: "Reaxys", field: "Chemistry", subfield: "Reactions & Synthesis", access: "Paid", url: "https://www.reaxys.com/", description: "Covers organic chemistry, organometallic and inorganic chemistry, and chemistry from patents. Merges Beilstein, Gmelin, and patent chemistry databases.", tags: ["Reactions", "Synthesis", "Patents"], org: "Elsevier" },
  { id: 16, name: "SciFinder-n", field: "Chemistry", subfield: "Chemical Literature", access: "Institutional", url: "https://scifinder-n.cas.org/", description: "Core chemistry research and discovery tool for finding chemical substances, reactions, journal articles, and patent records.", tags: ["Literature", "Patents", "Substances"], org: "CAS (ACS)" },
  { id: 17, name: "ChEMBL", field: "Chemistry", subfield: "Bioactivity", access: "Free", url: "https://www.ebi.ac.uk/chembl/", description: "Large-scale bioactivity database of drug-like molecules with binding, functional, and ADMET data from medicinal chemistry literature.", tags: ["Drug-like", "Bioactivity", "ADMET"], org: "EMBL-EBI" },
  { id: 18, name: "KEGG", field: "Chemistry", subfield: "Pathways & Metabolism", access: "Free (basic) / Paid", url: "https://www.kegg.jp/", description: "Kyoto Encyclopedia of Genes and Genomes. Covers metabolic pathways, drugs, diseases, and viruses. Improved taxonomic mapping.", tags: ["Pathways", "Metabolism", "Drugs"], org: "Kyoto University" },

  // BOTANY & PLANT BIOLOGY
  { id: 19, name: "Plants of the World Online (POWO)", field: "Botany & Plant Biology", subfield: "Taxonomy & Flora", access: "Free", url: "https://powo.science.kew.org/", description: "International collaborative programme making digitised data on the world's flora available. Delivers taxonomy, identification, images, distribution, traits, threat status, and molecular phylogenies for vascular plants worldwide.", tags: ["Taxonomy", "Flora", "Distribution", "Traits"], org: "Royal Botanic Gardens Kew" },
  { id: 20, name: "Tropicos", field: "Botany & Plant Biology", subfield: "Nomenclature & Specimens", access: "Free", url: "https://www.tropicos.org/", description: "Links over 1.33 million scientific names with over 4.87 million specimens and 685,000+ digital images, including over 150,000 references from 52,000+ publications.", tags: ["Specimens", "Nomenclature", "Images"], org: "Missouri Botanical Garden" },
  { id: 21, name: "TAIR", field: "Botany & Plant Biology", subfield: "Model Plant Genomics", access: "Free", url: "https://www.arabidopsis.org/", description: "The Arabidopsis Information Resource. Maintains genetic and molecular biology data for Arabidopsis thaliana: complete genome, gene structure, expression, DNA stocks, genome maps.", tags: ["Arabidopsis", "Genome", "Expression"], org: "Stanford University" },
  { id: 22, name: "Phytozome", field: "Botany & Plant Biology", subfield: "Comparative Genomics", access: "Free", url: "https://phytozome-next.jgi.doe.gov/", description: "Plant comparative genomics portal providing access to over 65 sequenced and annotated green plant genomes.", tags: ["Comparative", "Genomes", "Angiosperms"], org: "DOE Joint Genome Institute" },
  { id: 23, name: "JSTOR Global Plants", field: "Botany & Plant Biology", subfield: "Herbarium Specimens", access: "Free", url: "https://plants.jstor.org/", description: "The world's largest database of digitised plant specimens. Partner herbaria from dozens of countries contribute type specimens for taxonomic verification.", tags: ["Specimens", "Herbarium", "Types"], org: "JSTOR" },
  { id: 24, name: "Biodiversity Heritage Library (BHL)", field: "Botany & Plant Biology", subfield: "Historical Literature", access: "Free", url: "https://www.biodiversitylibrary.org/", description: "Consortium of natural history and botanical libraries. Digitised millions of pages of taxonomic literature, oldest titles dating back to the 16th century.", tags: ["Historical", "Literature", "Taxonomy"], org: "BHL Consortium" },
  { id: 25, name: "USDA PLANTS Database", field: "Botany & Plant Biology", subfield: "Native Plants (US)", access: "Free", url: "https://plants.usda.gov/", description: "Standardised information about vascular plants, mosses, liverworts, hornworts, and lichens of the US and territories. Searchable by state, county, and zip code.", tags: ["Native Plants", "Distribution", "US"], org: "USDA NRCS" },
  { id: 26, name: "PlantCyc / PMN", field: "Botany & Plant Biology", subfield: "Plant Metabolomics", access: "Free", url: "https://www.plantcyc.org/", description: "Plant Metabolic Network databases containing curated information on genes, enzymes, compounds, reactions, and pathways in primary and secondary plant metabolism.", tags: ["Metabolism", "Pathways", "Secondary metabolites"], org: "Carnegie Institution" },
  { id: 27, name: "IPNI", field: "Botany & Plant Biology", subfield: "Plant Names Index", access: "Free", url: "https://www.ipni.org/", description: "International Plant Names Index. Provides nomenclatural data for scientific names of vascular plants: spelling, author, types, and first place/date of publication.", tags: ["Nomenclature", "Names", "Vascular plants"], org: "Kew / Harvard / ANBG" },
  { id: 28, name: "Botanicus", field: "Botany & Plant Biology", subfield: "Historic Literature", access: "Free", url: "https://www.botanicus.org/", description: "Freely accessible portal to historic botanical literature from the Missouri Botanical Garden Library. Botanical illustrations and original species descriptions.", tags: ["Historic", "Illustrations", "Literature"], org: "Missouri Botanical Garden" },
  { id: 29, name: "GBIF", field: "Botany & Plant Biology", subfield: "Species Occurrence", access: "Free", url: "https://www.gbif.org/", description: "Global Biodiversity Information Facility. Occurrence records for species globally, aggregating museum, herbarium, and field observation data.", tags: ["Occurrence", "Biodiversity", "Observations"], org: "GBIF" },

  // NEUROSCIENCE
  { id: 30, name: "Allen Brain Atlas", field: "Neuroscience", subfield: "Brain Gene Expression", access: "Free", url: "https://portal.brain-map.org/", description: "Comprehensive gene expression data mapped to mouse and human brain. Includes cell type taxonomies, connectivity maps, and developmental transcriptomics.", tags: ["Brain", "Expression", "Connectivity"], org: "Allen Institute" },
  { id: 31, name: "OpenNeuro", field: "Neuroscience", subfield: "Neuroimaging Data", access: "Free", url: "https://openneuro.org/", description: "Open repository for raw MRI, MEG, EEG, iEEG, and ECoG data from human neuroscience studies in BIDS format.", tags: ["MRI", "EEG", "BIDS", "Imaging"], org: "Stanford / OpenNeuro" },
  { id: 32, name: "NIF / Neuroscience Information Framework", field: "Neuroscience", subfield: "Aggregated Resources", access: "Free", url: "https://neuinfo.org/", description: "NIH-supported data repository searchable by type of data or NIH Institute/Center. Aggregates tools, data, and literature for neuroscience.", tags: ["Aggregator", "Tools", "Literature"], org: "NIH / UCSD" },

  // PHARMACOLOGY
  { id: 33, name: "DrugBank", field: "Pharmacology", subfield: "Drug Information", access: "Free (basic) / Paid", url: "https://go.drugbank.com/", description: "Used by over 1,500 research institutions and cited in over 58,000 publications. Provides comprehensive biomedical knowledge covering drug profiles, targets, interactions, and mechanisms.", tags: ["Drugs", "Targets", "Interactions"], org: "DrugBank / University of Alberta" },
  { id: 34, name: "IUPHAR Guide to Pharmacology", field: "Pharmacology", subfield: "Drug Targets & Ligands", access: "Free", url: "https://www.guidetopharmacology.org/", description: "Curated, expert-reviewed database of drug targets, receptors, ion channels, transporters, and their ligands covering approved drugs and pharmacological standards.", tags: ["Receptors", "Ligands", "Ion channels"], org: "IUPHAR / BPS" },
  { id: 35, name: "DrugMAP", field: "Pharmacology", subfield: "Drug Mechanisms", access: "Free", url: "https://drugmap.idrblab.net/", description: "Includes information on combinatorial drug treatments, repurposed drugs, and off-target drug effects.", tags: ["Repurposing", "Off-target", "Combinations"], org: "IDRBLAB" },

  // EPIGENOMICS
  { id: 36, name: "ENCODE", field: "Epigenomics", subfield: "Functional Genome Elements", access: "Free", url: "https://www.encodeproject.org/", description: "Encyclopedia of DNA Elements. Comprehensive resource for functional elements in the human genome including TF binding, histone modifications, chromatin accessibility, and DNA methylation.", tags: ["Histone", "Chromatin", "ATAC-seq", "Methylation"], org: "NHGRI / NIH" },
  { id: 37, name: "Roadmap Epigenomics", field: "Epigenomics", subfield: "Chromatin States", access: "Free", url: "https://egg2.wustl.edu/roadmap/web_portal/", description: "Maps of histone modifications and chromatin state across hundreds of human tissue and cell types. Essential for understanding gene regulation in disease contexts.", tags: ["Histone", "Tissues", "Chromatin states"], org: "NIH Roadmap" },

  // METABOLOMICS
  { id: 38, name: "HMDB", field: "Metabolomics", subfield: "Human Metabolites", access: "Free", url: "https://hmdb.ca/", description: "Human Metabolome Database. Over 220,000 metabolite entries with chemical, clinical, and biological data. Invaluable for NMR and mass spec data interpretation.", tags: ["Metabolites", "NMR", "Mass spec"], org: "University of Alberta" },
  { id: 39, name: "MetaboLights", field: "Metabolomics", subfield: "Metabolomics Repository", access: "Free", url: "https://www.ebi.ac.uk/metabolights/", description: "Public metabolomics repository compatible with functional genomics and proteomics data. Metadata structured in standardised MAGE-TAB format, integrating with PRIDE at EBI.", tags: ["Repository", "Multi-omics", "Standardised"], org: "EMBL-EBI" },
  { id: 40, name: "XCMS Online", field: "Metabolomics", subfield: "LC/MS Analysis", access: "Free", url: "https://xcmsonline.scripps.edu/", description: "Allows users to pull out pathways predicted to be dysregulated from LC/MS data. Creates Pathway Cloud Plots and can integrate proteomic and genomic data.", tags: ["LC/MS", "Pathway analysis", "Dysregulation"], org: "Scripps Research" },

  // SINGLE CELL & TRANSCRIPTOMICS
  { id: 41, name: "GTEx", field: "Transcriptomics", subfield: "Tissue Gene Expression", access: "Free", url: "https://gtexportal.org/", description: "Genotype-Tissue Expression. Gene expression and eQTL data across 54 human tissues from nearly 1,000 donors. Gold standard for tissue-specific expression analysis.", tags: ["eQTL", "Tissues", "Expression"], org: "NIH" },
  { id: 42, name: "Human Cell Atlas", field: "Transcriptomics", subfield: "Single-Cell Atlas", access: "Free", url: "https://www.humancellatlas.org/", description: "Reference maps of all human cells integrating scRNA-seq, spatial transcriptomics, and proteomics across all organs.", tags: ["scRNA-seq", "Cell types", "Spatial"], org: "Global Consortium" },
  { id: 43, name: "CELLxGENE", field: "Transcriptomics", subfield: "Single-Cell Explorer", access: "Free", url: "https://cellxgene.cziscience.com/", description: "Interactive explorer for single-cell gene expression datasets. Over 50 million cells from published studies across organs and disease states.", tags: ["scRNA-seq", "Interactive", "50M cells"], org: "Chan Zuckerberg Initiative" },

  // CANCER BIOLOGY
  { id: 44, name: "cBioPortal", field: "Cancer Biology", subfield: "Cancer Genomics", access: "Free", url: "https://www.cbioportal.org/", description: "Exploration of multidimensional cancer genomics datasets. Integrates TCGA and other studies with clinical annotation.", tags: ["Mutations", "CNV", "Clinical", "Survival"], org: "Memorial Sloan Kettering / Broad" },
  { id: 45, name: "COSMIC", field: "Cancer Biology", subfield: "Somatic Mutations", access: "Free (research) / Paid", url: "https://cancer.sanger.ac.uk/cosmic", description: "Catalogue of Somatic Mutations in Cancer. Most comprehensive somatic mutation database. Covers point mutations, CNVs, fusions, and gene expression changes.", tags: ["Somatic mutations", "Fusions", "CNV"], org: "Wellcome Sanger Institute" },
  { id: 46, name: "OncoDB", field: "Cancer Biology", subfield: "Multi-omics Cancer", access: "Free", url: "https://oncodb.ca/", description: "Adds new database modalities such as proteomics and chromatin accessibility, with sophisticated tools to explore cross-omics relationships.", tags: ["Proteomics", "Chromatin", "Cross-omics"], org: "OncoDB Consortium" },

  // MICROBIOLOGY
  { id: 47, name: "SILVA", field: "Microbiology & Virology", subfield: "Ribosomal RNA", access: "Free", url: "https://www.arb-silva.de/", description: "Ribosomal RNA sequence database for bacteria, archaea, and eukarya. Widely used in microbiome research for 16S/18S rRNA classification.", tags: ["16S rRNA", "Microbiome", "Archaea"], org: "Max Planck / University of Bremen" },
  { id: 48, name: "PHI-base", field: "Microbiology & Virology", subfield: "Host-Pathogen Interactions", access: "Free", url: "http://www.phi-base.org/", description: "Links gene information to phenotypic information from microbial pathogens on their hosts, with information manually curated from peer-reviewed literature.", tags: ["Pathogens", "Host-pathogen", "Phenotype"], org: "Rothamsted Research" },

  // CLINICAL & HEALTH
  { id: 49, name: "ClinicalTrials.gov", field: "Clinical & Health", subfield: "Clinical Trials", access: "Free", url: "https://clinicaltrials.gov/", description: "Registry and results database for publicly and privately funded clinical studies. Over 490,000 registered trials globally.", tags: ["Trials", "Interventions", "Results"], org: "NIH / NLM" },
  { id: 50, name: "OMIM", field: "Clinical & Health", subfield: "Genetic Disorders", access: "Free", url: "https://www.omim.org/", description: "Online Mendelian Inheritance in Man. Comprehensive catalogue of human genes and genetic disorders with gene-disease relationships and literature references.", tags: ["Genetic disorders", "Mendelian", "Disease genes"], org: "Johns Hopkins University" },
  { id: 51, name: "GeneCards", field: "Clinical & Health", subfield: "Human Gene Database", access: "Free (basic) / Paid", url: "https://www.genecards.org/", description: "Integrative human gene database aggregating data from over 150 sources including genomics, proteomics, transcriptomics, and clinical data.", tags: ["Gene summaries", "Disease", "Multi-omics"], org: "Weizmann Institute" },

  // IMMUNOLOGY
  { id: 52, name: "ImmPort", field: "Immunology", subfield: "Immunology Data", access: "Free", url: "https://www.immport.org/", description: "NIH-funded repository for immunology research including clinical trials, flow cytometry, gene expression, and assay data from NIAID-funded studies.", tags: ["Flow cytometry", "Immune", "Assays"], org: "NIH / NIAID" },
  { id: 53, name: "Reactome", field: "Immunology", subfield: "Pathways & Signalling", access: "Free", url: "https://reactome.org/", description: "Curated, peer-reviewed pathway database covering human biology. Covers signalling, metabolism, gene expression, and immune function with cross-references to model organisms.", tags: ["Pathways", "Signalling", "Curated"], org: "Ontario Institute for Cancer Research" },

  // LITERATURE
  { id: 54, name: "PubMed / MEDLINE", field: "Literature & Multidisciplinary", subfield: "Biomedical Literature", access: "Free", url: "https://pubmed.ncbi.nlm.nih.gov/", description: "Over 35 million citations for biomedical literature from MEDLINE, life science journals, and online books. The primary literature database for life sciences.", tags: ["Citations", "Abstracts", "Biomedical"], org: "NLM / NIH" },
  { id: 55, name: "Europe PMC", field: "Literature & Multidisciplinary", subfield: "Life Science Literature", access: "Free", url: "https://europepmc.org/", description: "Life sciences literature database including preprints, supplementary data, and grant information. European mirror of PubMed with enhanced features.", tags: ["Preprints", "Grants", "Open access"], org: "EMBL-EBI" },
  { id: 56, name: "Scopus", field: "Literature & Multidisciplinary", subfield: "All Disciplines", access: "Institutional", url: "https://www.scopus.com/", description: "All disciplines; journal rankings, h-index, and citation tracking. One of the two largest academic citation databases.", tags: ["Citations", "h-index", "Metrics"], org: "Elsevier" },
  { id: 57, name: "Web of Science", field: "Literature & Multidisciplinary", subfield: "All Disciplines", access: "Institutional", url: "https://www.webofscience.com/", description: "All disciplines; citation indexing across journals, books, and conference proceedings.", tags: ["Citation", "Impact factor", "All fields"], org: "Clarivate" },
  { id: 58, name: "bioRxiv / medRxiv", field: "Literature & Multidisciplinary", subfield: "Preprints", access: "Free", url: "https://www.biorxiv.org/", description: "Life science preprints (not peer-reviewed). Essential for accessing cutting-edge unpublished research before formal publication.", tags: ["Preprints", "Unreviewed", "Open access"], org: "Cold Spring Harbor Laboratory" },

  // ECOLOGY
  { id: 59, name: "BOLD (Barcode of Life)", field: "Ecology & Environment", subfield: "Species Identification", access: "Free", url: "https://www.boldsystems.org/", description: "DNA barcode library for species identification, covering millions of specimens from animals, plants, and fungi.", tags: ["DNA barcoding", "Species ID", "COI"], org: "University of Guelph" },
  { id: 60, name: "IUCN Red List", field: "Ecology & Environment", subfield: "Conservation Status", access: "Free", url: "https://www.iucnredlist.org/", description: "The world's most comprehensive information source on global extinction risk status of animal, fungus, and plant species.", tags: ["Conservation", "Extinction", "Threat status"], org: "IUCN" },

  // STRUCTURAL BIOLOGY
  { id: 61, name: "EMDB", field: "Structural Biology", subfield: "Cryo-EM Data", access: "Free", url: "https://www.ebi.ac.uk/emdb/", description: "Electron Microscopy Data Bank. Repository for cryo-EM density maps and associated metadata. Closely linked to PDB.", tags: ["Cryo-EM", "Density maps", "Macromolecules"], org: "EMBL-EBI" },
  { id: 62, name: "BindingDB", field: "Structural Biology", subfield: "Binding Affinities", access: "Free", url: "https://www.bindingdb.org/", description: "Measured binding affinities between proteins and small drug-like molecules. Useful for structure-activity relationship studies.", tags: ["Binding affinity", "SAR", "Drug design"], org: "University of Maryland" },

  // AGRICULTURE
  { id: 63, name: "USDA FoodData Central", field: "Agriculture & Food Science", subfield: "Nutrient Composition", access: "Free", url: "https://fdc.nal.usda.gov/", description: "Comprehensive nutrient composition database covering branded and generic foods with detailed macro and micronutrient profiles.", tags: ["Nutrients", "Food composition", "Branded foods"], org: "USDA" },
  { id: 64, name: "CAZy", field: "Agriculture & Food Science", subfield: "Carbohydrate Enzymes", access: "Free", url: "http://www.cazy.org/", description: "Carbohydrate-Active Enzymes Database. Critical for plant cell wall biology and microbiome research. Covers metabolism and signalling with updated enzyme family descriptions.", tags: ["Cell wall", "Enzymes", "Carbohydrates"], org: "AFMB / CNRS" },
];

const FIELDS = [...new Set(databases.map(d => d.field))];
const ACCESS_TYPES = ["All", "Free", "Free (basic) / Paid", "Paid", "Institutional"];

const fieldColors = {
  "Genomics & Genetics": { bg: "#0d1f3c", accent: "#4fc3f7", dot: "#4fc3f7" },
  "Proteomics": { bg: "#1a0d3c", accent: "#ce93d8", dot: "#ce93d8" },
  "Chemistry": { bg: "#0d2c1a", accent: "#80cbc4", dot: "#80cbc4" },
  "Botany & Plant Biology": { bg: "#1a2c0d", accent: "#a5d6a7", dot: "#66bb6a" },
  "Neuroscience": { bg: "#2c1a0d", accent: "#ffcc80", dot: "#ffa726" },
  "Pharmacology": { bg: "#2c0d1a", accent: "#f48fb1", dot: "#f06292" },
  "Epigenomics": { bg: "#0d2c2c", accent: "#80deea", dot: "#26c6da" },
  "Metabolomics": { bg: "#2c2c0d", accent: "#fff59d", dot: "#ffee58" },
  "Transcriptomics": { bg: "#0d1a2c", accent: "#90caf9", dot: "#42a5f5" },
  "Cancer Biology": { bg: "#2c0d0d", accent: "#ef9a9a", dot: "#ef5350" },
  "Microbiology & Virology": { bg: "#1a0d2c", accent: "#b39ddb", dot: "#7e57c2" },
  "Clinical & Health": { bg: "#0d2c1a", accent: "#a5d6a7", dot: "#4caf50" },
  "Immunology": { bg: "#2c1a0d", accent: "#ffab91", dot: "#ff7043" },
  "Literature & Multidisciplinary": { bg: "#1a1a1a", accent: "#e0e0e0", dot: "#9e9e9e" },
  "Ecology & Environment": { bg: "#0d2c0d", accent: "#c5e1a5", dot: "#8bc34a" },
  "Structural Biology": { bg: "#0d1a2c", accent: "#81d4fa", dot: "#29b6f6" },
  "Agriculture & Food Science": { bg: "#2c1a00", accent: "#ffcc80", dot: "#ff9800" },
};

const accessBadge = {
  "Free": { bg: "#1b4332", color: "#52b788", label: "Free" },
  "Free (basic) / Paid": { bg: "#1c2951", color: "#74b9ff", label: "Freemium" },
  "Paid": { bg: "#3d1515", color: "#ff7675", label: "Paid" },
  "Institutional": { bg: "#2d2316", color: "#fdcb6e", label: "Institutional" },
};

export default function ScientificDatabasesExplorer() {
  const [search, setSearch] = useState("");
  const [selectedField, setSelectedField] = useState("All");
  const [selectedAccess, setSelectedAccess] = useState("All");
  const [selectedDb, setSelectedDb] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  const filtered = useMemo(() => {
    return databases.filter(db => {
      const matchSearch = search === "" ||
        db.name.toLowerCase().includes(search.toLowerCase()) ||
        db.description.toLowerCase().includes(search.toLowerCase()) ||
        db.tags.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
        db.field.toLowerCase().includes(search.toLowerCase()) ||
        db.subfield.toLowerCase().includes(search.toLowerCase());
      const matchField = selectedField === "All" || db.field === selectedField;
      const matchAccess = selectedAccess === "All" || db.access === selectedAccess;
      return matchSearch && matchField && matchAccess;
    });
  }, [search, selectedField, selectedAccess]);

  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach(db => {
      if (!groups[db.field]) groups[db.field] = [];
      groups[db.field].push(db);
    });
    return groups;
  }, [filtered]);

  const stats = useMemo(() => ({
    total: databases.length,
    free: databases.filter(d => d.access === "Free").length,
    fields: FIELDS.length,
    filtered: filtered.length,
  }), [filtered]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080c12",
      color: "#e8eaf0",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background grid pattern */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
        pointerEvents: "none",
      }} />

      {/* Glowing orbs */}
      <div style={{
        position: "fixed", top: -200, right: -200,
        width: 500, height: 500,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(79,195,247,0.06) 0%, transparent 70%)",
        zIndex: 0, pointerEvents: "none",
      }} />
      <div style={{
        position: "fixed", bottom: -100, left: -100,
        width: 400, height: 400,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(102,187,106,0.05) 0%, transparent 70%)",
        zIndex: 0, pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "0 16px 80px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", padding: "48px 0 32px" }}>
          <div style={{
            display: "inline-block",
            fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase",
            color: "#4fc3f7", marginBottom: 16,
            background: "rgba(79,195,247,0.08)", padding: "4px 16px", borderRadius: 20,
            border: "1px solid rgba(79,195,247,0.2)",
            fontFamily: "'Courier New', monospace",
          }}>
            Research Intelligence
          </div>
          <h1 style={{
            fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 400,
            letterSpacing: "-0.02em", margin: "0 0 12px",
            background: "linear-gradient(135deg, #e8eaf0 0%, #90caf9 50%, #a5d6a7 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            lineHeight: 1.15,
          }}>
            Scientific Databases<br />& Knowledge Repositories
          </h1>
          <p style={{
            color: "#8899aa", fontSize: 16, maxWidth: 540, margin: "0 auto 32px",
            lineHeight: 1.6, fontStyle: "italic",
          }}>
            A curated atlas of {stats.total} databases across {stats.fields} disciplines — from genomics to botany, chemistry to clinical data.
          </p>

          {/* Stats row */}
          <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", marginBottom: 8 }}>
            {[
              { label: "Total Databases", value: stats.total },
              { label: "Free Access", value: stats.free },
              { label: "Disciplines", value: stats.fields },
              { label: "Showing", value: stats.filtered },
            ].map(s => (
              <div key={s.label} style={{
                textAlign: "center",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 12, padding: "10px 20px",
              }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#4fc3f7", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "#667788", marginTop: 2, fontFamily: "'Courier New', monospace", letterSpacing: "0.05em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Search + Filters */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16, padding: "20px 24px", marginBottom: 28,
          backdropFilter: "blur(10px)",
        }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            {/* Search */}
            <div style={{ flex: "1 1 240px", position: "relative" }}>
              <span style={{
                position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                fontSize: 16, color: "#667788",
              }}>⌕</span>
              <input
                placeholder="Search databases, fields, tags…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10, padding: "10px 12px 10px 36px",
                  color: "#e8eaf0", fontSize: 14,
                  fontFamily: "'Courier New', monospace",
                  outline: "none",
                }}
              />
            </div>

            {/* Field filter */}
            <select
              value={selectedField}
              onChange={e => setSelectedField(e.target.value)}
              style={{
                flex: "1 1 180px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10, padding: "10px 12px",
                color: "#e8eaf0", fontSize: 13,
                fontFamily: "'Courier New', monospace",
                outline: "none", cursor: "pointer",
              }}
            >
              <option value="All">All Fields</option>
              {FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>

            {/* Access filter */}
            <select
              value={selectedAccess}
              onChange={e => setSelectedAccess(e.target.value)}
              style={{
                flex: "0 1 160px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10, padding: "10px 12px",
                color: "#e8eaf0", fontSize: 13,
                fontFamily: "'Courier New', monospace",
                outline: "none", cursor: "pointer",
              }}
            >
              {ACCESS_TYPES.map(a => <option key={a} value={a}>{a === "All" ? "All Access" : a}</option>)}
            </select>

            {/* View toggle */}
            <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: 3 }}>
              {["grid", "list"].map(v => (
                <button
                  key={v}
                  onClick={() => setViewMode(v)}
                  style={{
                    background: viewMode === v ? "rgba(79,195,247,0.2)" : "transparent",
                    border: viewMode === v ? "1px solid rgba(79,195,247,0.4)" : "1px solid transparent",
                    borderRadius: 6, padding: "6px 12px",
                    color: viewMode === v ? "#4fc3f7" : "#667788",
                    fontSize: 12, cursor: "pointer",
                    fontFamily: "'Courier New', monospace",
                    letterSpacing: "0.05em",
                  }}
                >
                  {v === "grid" ? "⊞ Grid" : "≡ List"}
                </button>
              ))}
            </div>
          </div>

          {/* Field quick-filter pills */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 14 }}>
            <button
              onClick={() => setSelectedField("All")}
              style={{
                background: selectedField === "All" ? "rgba(79,195,247,0.15)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${selectedField === "All" ? "rgba(79,195,247,0.4)" : "rgba(255,255,255,0.07)"}`,
                borderRadius: 20, padding: "4px 12px",
                color: selectedField === "All" ? "#4fc3f7" : "#667788",
                fontSize: 11, cursor: "pointer",
                fontFamily: "'Courier New', monospace", letterSpacing: "0.05em",
              }}
            >All</button>
            {FIELDS.map(f => {
              const c = fieldColors[f] || { accent: "#aaa", dot: "#aaa" };
              const isActive = selectedField === f;
              return (
                <button
                  key={f}
                  onClick={() => setSelectedField(isActive ? "All" : f)}
                  style={{
                    background: isActive ? `rgba(${hexToRgb(c.accent)}, 0.15)` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isActive ? `rgba(${hexToRgb(c.accent)}, 0.5)` : "rgba(255,255,255,0.07)"}`,
                    borderRadius: 20, padding: "4px 10px",
                    color: isActive ? c.accent : "#667788",
                    fontSize: 11, cursor: "pointer",
                    fontFamily: "'Courier New', monospace", letterSpacing: "0.03em",
                    display: "flex", alignItems: "center", gap: 5,
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: isActive ? c.dot : "#445566", display: "inline-block" }} />
                  {f.split(" & ")[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#4a5a6a", fontSize: 16, fontStyle: "italic" }}>
            No databases match your search. Try different terms.
          </div>
        ) : (
          Object.entries(grouped).map(([field, dbs]) => {
            const palette = fieldColors[field] || { bg: "#111", accent: "#aaa", dot: "#aaa" };
            return (
              <div key={field} style={{ marginBottom: 40 }}>
                {/* Field header */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: palette.dot, flexShrink: 0 }} />
                  <h2 style={{
                    fontSize: 13, fontWeight: 600, letterSpacing: "0.15em",
                    textTransform: "uppercase", color: palette.accent,
                    fontFamily: "'Courier New', monospace", margin: 0,
                  }}>{field}</h2>
                  <div style={{
                    fontSize: 11, color: "#445566",
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 10, padding: "2px 8px", fontFamily: "'Courier New', monospace",
                  }}>{dbs.length} databases</div>
                  <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, rgba(${hexToRgb(palette.accent)}, 0.2), transparent)` }} />
                </div>

                {/* Cards */}
                <div style={{
                  display: viewMode === "grid"
                    ? "grid"
                    : "flex",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  flexDirection: viewMode === "list" ? "column" : undefined,
                  gap: 12,
                }}>
                  {dbs.map(db => {
                    const badge = accessBadge[db.access] || accessBadge["Free"];
                    const isSelected = selectedDb?.id === db.id;
                    return (
                      <div
                        key={db.id}
                        onClick={() => setSelectedDb(isSelected ? null : db)}
                        style={{
                          background: isSelected
                            ? `rgba(${hexToRgb(palette.accent)}, 0.08)`
                            : "rgba(255,255,255,0.03)",
                          border: `1px solid ${isSelected ? `rgba(${hexToRgb(palette.accent)}, 0.4)` : "rgba(255,255,255,0.07)"}`,
                          borderRadius: 14, padding: viewMode === "list" ? "14px 20px" : "18px",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          display: viewMode === "list" ? "flex" : "block",
                          alignItems: viewMode === "list" ? "flex-start" : undefined,
                          gap: viewMode === "list" ? 16 : undefined,
                        }}
                      >
                        {/* Top row */}
                        <div style={{
                          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                          marginBottom: viewMode === "list" ? 0 : 10,
                          flex: viewMode === "list" ? "0 0 200px" : undefined,
                          minWidth: viewMode === "list" ? 200 : undefined,
                        }}>
                          <div>
                            <div style={{
                              fontSize: 14, fontWeight: 600, color: "#e8eaf0",
                              lineHeight: 1.3, marginBottom: 3,
                            }}>{db.name}</div>
                            <div style={{
                              fontSize: 11, color: "#556677",
                              fontFamily: "'Courier New', monospace", letterSpacing: "0.03em",
                            }}>{db.subfield}</div>
                          </div>
                          <span style={{
                            fontSize: 10, padding: "3px 8px", borderRadius: 8,
                            background: badge.bg, color: badge.color,
                            border: `1px solid ${badge.color}30`,
                            fontFamily: "'Courier New', monospace", letterSpacing: "0.05em",
                            flexShrink: 0, marginLeft: 8,
                          }}>{badge.label}</span>
                        </div>

                        {/* Description — expanded on click or list mode */}
                        {(isSelected || viewMode === "list") && (
                          <div style={{ flex: 1 }}>
                            <p style={{
                              fontSize: 12.5, color: "#8899aa", lineHeight: 1.6, margin: "0 0 10px",
                              fontStyle: "italic",
                            }}>{db.description}</p>
                            <div style={{ fontSize: 11, color: "#556677", marginBottom: 8 }}>
                              <span style={{ color: "#667788" }}>Org: </span>{db.org}
                            </div>
                            <a
                              href={db.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              style={{
                                display: "inline-flex", alignItems: "center", gap: 4,
                                fontSize: 11, color: palette.accent,
                                textDecoration: "none",
                                background: `rgba(${hexToRgb(palette.accent)}, 0.08)`,
                                border: `1px solid rgba(${hexToRgb(palette.accent)}, 0.2)`,
                                borderRadius: 6, padding: "4px 10px",
                                fontFamily: "'Courier New', monospace",
                                transition: "all 0.15s",
                              }}
                            >
                              ↗ Visit Database
                            </a>
                          </div>
                        )}

                        {/* Tags */}
                        {viewMode === "grid" && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: isSelected ? 10 : 0 }}>
                            {db.tags.map(tag => (
                              <span key={tag} style={{
                                fontSize: 10, padding: "2px 7px", borderRadius: 6,
                                background: "rgba(255,255,255,0.04)",
                                color: "#5a6a7a",
                                border: "1px solid rgba(255,255,255,0.06)",
                                fontFamily: "'Courier New', monospace",
                              }}>{tag}</span>
                            ))}
                          </div>
                        )}

                        {!isSelected && viewMode === "grid" && (
                          <div style={{ marginTop: 10, fontSize: 11, color: "#3a4a5a", fontStyle: "italic" }}>
                            Click to expand ↓
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}

        {/* Footer */}
        <div style={{
          textAlign: "center", marginTop: 60,
          borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24,
          color: "#3a4a5a", fontSize: 11, fontFamily: "'Courier New', monospace", letterSpacing: "0.08em",
        }}>
          {stats.total} DATABASES ACROSS {stats.fields} FIELDS — LAST UPDATED 2025
        </div>
      </div>
    </div>
  );
}

// Helper to convert hex color to rgb values for rgba()
function hexToRgb(hex) {
  if (!hex) return "150,150,150";
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r},${g},${b}`;
}
