# ENVRI-FAIR
2021 ENVRI Community International School Services for FAIRness
Group 3

## Aim for the web service:

We will base our web service on the datasets and metadata published at:
http://ipt.medobis.eu/
                                                                                
The Integrated Publishing Toolkit (IPT) is a free, open source software tool
used to publish and share biodiversity datasets through the GBIF network.
                                                                                
MedOBIS is the Regional OBIS Node (https://obis.org/) for the Mediterranean
Sea. It is hosted by the Hellenic Centre for Marine Research (HCMR) in its
Institute of Marine Biology, Biotechnology and Aquaculture (IMBBC) in Heraklion
(Crete). MedOBIS acts as a Marine Research Repository for both historical and
modern marine datasets, on which the principles of FAIR and Open data are          
applied.                                                                           
                                                                                   
The web service should be able to:
- answer to specific questions related to available metadata.
  Such questions could be:
 - Who is the contact person(s) of the specific dataset?
 - What time period is covered by the dataset?
 - What is the license of data (copyrights)?
 - What is the dataset URL?
                                                                                   
Our aim is to collect rich metadata and make those available and accessible to
data users, according to FAIR principles.
                                                                                   
## Possible approaches to build the web service
The requirement on the service is to list datasets and retrieve information
about each dataset. This implies that only GET requests will be necessary
- An entirely possible approach is therefore to  build a custom API with
  functions to list data sets, retrieve contact information, etc., for example
  /list-datasets, /get-contact
- A data centred  minimal (RESTful) API supporting the GET method to query for
  properties of the datasets.  In this case the two approaches are similar
  since no posting or modification of data will be allowed. We therefore suggest
  a data centred approach implementing the GET methods
  - /service/datasetId/time
  - /service/datasetId/contact
  - /service/datasetId/license
                                                                                   
The results should be returned as plain text or JSON (for this example we will
not use a full schema such as DataCite but only the above information)
                                                                                   
## Possible tools for building the Web API
- Java servlets are the traditional way, deployed on a servlet container such
  as Tomcat or Jetty. We lack the expertise to develop and deploy such a
  solution.
- Python web frameworks. There are many: full-fledged full stack solutions such
  as Django, as well as smaller ones. It is easy to find tutorials on Flask,
  CherryPy etc. There are also modern frameworks taking advantage of the
  asynchronous IO of recent Python versions, however there are many of them so
  long term sustainability is questionable.
- Node.js server side Javascript. This has the advantages of:
  - Javascript is a common web development language and the main client side language
  - Fast, asynchronous IO, etc.


The tools listed all have large user bases, ensuring long term support.
For this project we selected the Node.js approach as it provides good performance
and allows easy standalone testing during development, whereas Flask and CherryPy
should preferraby run behind a proxy (Apache or Nginx).

## Security considerations
- The service should not be able to modify any data repository
- Users of the service should authenticate
- The service will return URLs so care has to be taken not to allow cross site scripting,
		that is, injecting code into URLs that would redirect to another service and perform
		operations on it.
- Rate of queries should be limited so as to mitigate DDoS attacks
- Operations should be logged

# Deployment

## Dependencies of the app
- express: npm install --save express
 