# "services" directory

This directory contains modules that implement singleton "services". These are intended to be started once, often at app launch time.

The ServiceManager is responsible for starting services in a well-defined order. It will start dependent services in dependency order.
