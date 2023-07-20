import React, { useEffect } from "react";
import DatasetStyle from "../../styles/Dataset";
import {
  Typography,
  Card,
  Grid,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import CircleIcon from "@mui/icons-material/Circle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import TranslateIcon from "@mui/icons-material/Translate";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import QueryStatsIcon from "@mui/icons-material/QueryStats";

const useCaseData = [
  {
    content:
      "Chitralekha is an open-source platform designed to facilitate video annotation, transcription, and translation in diverse Indic languages.",
  },
  {
    content:
      "It leverages machine learning models to provide accurate and efficient video transcription and translation services.",
  },
  {
    content:
      "Chitralekha supports a wide range of features, including transcription, translation, voice-over generation, speaker tagging, subtitle upload to YouTube, and noise tagging.",
  },
  {
    content:
      "Chitralekha simplifies the process of creating multilingual subtitles and voice-over translations, making content accessible and inclusive to a wider audience.",
  },
  {
    content:
      "Chitralekha allows the identification and labeling of speakers in videos, enhancing organization and understanding of conversations or presentations.",
  },
  {
    content:
      "Subtitles generated with Chitralekha can be directly uploaded to YouTube, ensuring seamless integration with the platform.",
  },
  {
    content:
      "Transcriptions can be exported in a bilingual docx format, facilitating further translation or analysis.",
  },
  {
    content:
      "Chitralekha supports the export of voice-overs in various formats, including mp4, mp3, wav, and flac.",
  },
  {
    content:
      "The platform includes noise tagging functionality to handle and label audio disturbances during video editing.",
  },
  {
    content:
      "Over 300 hours of lectures and video content have been transcribed and translated across 7 organizations, benefiting learners in 8 Indic languages.",
  },
  {
    content:
      "NPTEL is in the process of translating approximately 36,000 hours of video lectures into multiple Indic languages using Chitralekha.",
  },
];

function UseCases() {
  const classes = DatasetStyle();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <div style={{ margin: "120px 0px 20px 0px" }}>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Card className={classes.usecaseCard}>
          <Typography variant="h4" sx={{ mt: 3, mb: 2 }}>
            Chitralekha - Use Cases
          </Typography>
          <Grid sx={{ pl: 6, pr: 6, mb: 5 }}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <List>
                {useCaseData?.map((el, i) => (
                  <ListItem sx={{ p: "8px", alignItems: "baseline" }}>
                    <CircleIcon sx={{ fontSize: "10px", color: "#707070" }} />
                    <ListItemText
                      className={classes.usecaseFeatures}
                      primary={el.content}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Typography align="center" className={classes.usecaseNote}>
              Note - These points highlight the key features, benefits, and
              impact of Chitralekha in enabling video transcription, translation
              etc in Indic languages.
            </Typography>
            <Typography
              variant="h5"
              align="left"
              className={classes.usecaseTitle}
              sx={{ mt: 7 }}
            >
              Chitralekha can be used in various sectors as follows:
            </Typography>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ mt: 10 }}>
              <Grid
                container
                direction="row"
                alignItems="center"
                justifyContent="center"
                sx={{ mt: 2 }}
              >
                <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
                  <SchoolIcon className={classes.usecaseImg} />
                  <Typography
                    variant="h5"
                    sx={{ mb: 3, mt: 1 }}
                    className={classes.usecaseSubTitle}
                  >
                    Educational Videos
                  </Typography>
                  <Typography
                    variant="body1"
                    className={classes.usecaseContent}
                  >
                    Chitralekha is extensively used in the educational sector
                    for transcribing and translating videos into multiple Indic
                    languages. It helps educational institutions, online
                    learning platforms, and educators to provide accurate
                    subtitles and voice-overs, enabling students to access and
                    understand the content in their preferred language. This
                    promotes inclusive education and ensures equal learning
                    opportunities for all.
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                direction="row"
                alignItems="center"
                justifyContent="center"
                sx={{ mt: 4 }}
              >
                <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
                  <PlayCircleIcon className={classes.usecaseImg} />
                  <Typography
                    variant="h5"
                    sx={{ mb: 3, mt: 1 }}
                    className={classes.usecaseSubTitle}
                  >
                    Media and Entertainment Localization
                  </Typography>
                  <Typography
                    variant="body2"
                    className={classes.usecaseContent}
                  >
                    Chitralekha plays a vital role in the media and
                    entertainment industry by facilitating the localization of
                    content. It assists in transcribing and translating
                    audiovisual materials, such as movies, TV shows, and online
                    streaming content, into multiple Indic languages. This
                    enables content creators to reach a broader audience, expand
                    their market, and cater to diverse language communities.
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                direction="row"
                alignItems="center"
                justifyContent="center"
                sx={{ mt: 4 }}
              >
                <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
                  <QueryStatsIcon className={classes.usecaseImg} />
                  <Typography
                    variant="h5"
                    sx={{ mb: 3, mt: 1 }}
                    className={classes.usecaseSubTitle}
                  >
                    Research and Analysis
                  </Typography>
                  <Typography
                    variant="body2"
                    className={classes.usecaseContent}
                  >
                    Researchers often rely on Chitralekha for transcribing and
                    analyzing audio or video data in their studies. By
                    accurately transcribing and translating research materials,
                    Chitralekha streamlines the data analysis process, allowing
                    researchers to extract valuable insights and conduct
                    qualitative or quantitative analyses more efficiently.
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                direction="row"
                alignItems="center"
                justifyContent="center"
                sx={{ mt: 4 }}
              >
                <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
                  <TranslateIcon className={classes.usecaseImg} />
                  <Typography
                    variant="h5"
                    sx={{ mb: 3, mt: 1 }}
                    className={classes.usecaseSubTitle}
                  >
                    Language Resource Development
                  </Typography>
                  <Typography
                    variant="body2"
                    className={classes.usecaseContent}
                  >
                    Chitralekha significantly contributes to language resource
                    development efforts. By providing precise transcriptions and
                    translations, it aids in creating comprehensive language
                    databases, corpora, and linguistic resources. These
                    resources are invaluable for linguistic research, language
                    preservation, and advancing natural language processing
                    technologies for Indic languages.
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                direction="row"
                alignItems="center"
                justifyContent="center"
                sx={{ mt: 4 }}
              >
                <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
                  <LocalLibraryIcon className={classes.usecaseImg} />
                  <Typography
                    variant="h5"
                    sx={{ mb: 3, mt: 1 }}
                    className={classes.usecaseSubTitle}
                  >
                    E-Learning Platforms
                  </Typography>
                  <Typography
                    variant="body2"
                    className={classes.usecaseContent}
                  >
                    Chitralekha can widely be adopted by e-learning platforms
                    and online course providers. It enables the creation of
                    multilingual course content by transcribing and translating
                    instructional videos. This allows learners from diverse
                    linguistic backgrounds to access educational materials in
                    their native language, improving comprehension and
                    engagement.
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                direction="row"
                alignItems="center"
                justifyContent="space-around"
                sx={{ mt: 4 }}
              >
                <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
                  <RecordVoiceOverIcon className={classes.usecaseImg} />
                  <Typography
                    variant="h5"
                    sx={{ mb: 3, mt: 1 }}
                    className={classes.usecaseSubTitle}
                  >
                    Voice-over Services
                  </Typography>
                  <Typography
                    variant="body2"
                    className={classes.usecaseContent}
                  >
                    Chitralekha's voice-over generation feature is utilized in
                    various industries. It assists in producing high-quality
                    multilingual voice-overs for videos, presentations,
                    advertisements, and other audiovisual content. This helps
                    organizations effectively communicate their messages to a
                    broader audience, ensuring a consistent and professional
                    audio experience across different languages.
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </div>
  );
}
export default UseCases;
