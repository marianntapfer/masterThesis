\NeedsTeXFormat{LaTeX2e}

% the name if the new class I created
\ProvidesClass{thesis_proposal}[2022/05/08 TLU Master Thesis Proposal]

% Load an existing class as the base
\LoadClass[12pt, a4paper]{article}

\setlength{\parindent}{0cm}

\RequirePackage[left=20mm, right=20mm, top=25mm, bottom=25mm]{geometry}
\RequirePackage{ifthen}

\RequirePackage[]{times}
\RequirePackage{graphicx} 

\newcommand\school{School of Digital Technologies, Tallinn University, Estonia}
\newcommand\doctype{Research Proposal}

\newcommand{\email}[1]{\gdef\@email{#1}}%
\newcommand{\@email}{\@latex@warning@no@line{No \noexpand\email given}}

\renewcommand{\maketitle}{%
\begin{center}%
    {\LARGE \doctype \par}%
    {\LARGE \@title \par}%
    \vskip 3em%
    {\large
    \lineskip .75em%
    \begin{tabular}[t]{c}%
        \@author\\
        \@email
    \end{tabular}\par}%
    \school\\ 
      \vskip 1.5em%
    {\large \@date \par}%    
\end{center}\par
}


% \title{Research Proposal\\
% *****}

% \author{*********\\ 
%     School of Digital Technologies, Tallinn University, Estonia\\ 
%     ******}


\newenvironment{keywords}[1]{
    \begin{flushleft}
            \textbf{Keywords: }#1\\
    \end{flushleft}
}

\newenvironment{supervisor}[1]{
    % if contains comma then Supervisors
    \begin{flushleft}
        \textbf{Supervisor: }#1\\
    \end{flushleft}
    }


% \newif\ifsupervisor
% \supervisortrue
% \ifsupervisor
% \fi
% \supervisorfalse
% \ifsupervisor
% \fi

